import React, { useEffect, useState } from "react";
import roomRef from "../../server/firebase";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import { connect } from "react-redux";
import { generateId } from "../../App";
import isEmpty from "lodash.isempty";
import Pool from "./Pool/Pool";
import CloseButton from "../Shared/CloseButton/CloseButton";
import "./pools.scss";

const poolsRef = roomRef.child("pools");

export const defaultOptions = {
  0: {
    value: "Option 1",
    id: 0,
  },
  1: {
    value: "Option 2",
    id: 1,
  },
  2: {
    value: "Option 3",
    id: 2,
  },
};

export const defaultPool = {
  title: "",
  description: "",
  options: defaultOptions,
  questionsType: "",
  votes: {
    options: {},
    users: {},
  },
  type: "",
  id: null,
};

function arrayToObject(arr) {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i].id;
    res[key] = arr[i];
  }
  return res;
}

function getOptions({ options, votes }) {
  const allVotesCount = Object.values(votes.options).length;
  const arrayOfOptionsWithResults = Object.keys(options).map((optionId) => {
    return {
      ...options[optionId],
      result:
        Math.floor((votes.options[optionId]?.length / allVotesCount) * 100) ||
        0,
    };
  });

  return arrayToObject(arrayOfOptionsWithResults);
}

function mapPool(sourcePool) {
  const pool = {
    ...defaultPool,
    ...sourcePool,
  };

  return {
    ...pool,
    options: getOptions(pool),
  };
}

const Pools = ({ user, open, onClose }) => {
  const [pools, setPools] = useState([]);
  const [placeholderPool, setPlaceholderPool] = useState({});
  const userId = Object.keys(user)[0];
  const isManager = true;
  const poolsLimit = 2;

  function createPool(pool) {
    const poolId = generateId();

    poolsRef.child(poolId).set({
      ...pool,
      id: poolId,
      userId,
    });
    setPlaceholderPool({});
  }

  function updatePool(updatedPool) {
    poolsRef.child(updatedPool.id).set(updatedPool);
    setPlaceholderPool({});
  }

  function addNewPool() {
    setPlaceholderPool(defaultPool);
  }
  function deletePool(id) {
    poolsRef.child(id).set(null);
  }

  function subscribeOnpools() {
    poolsRef.on("value", (snap) => {
      const data = snap.val();
      if (data) {
        setPools([...Object.values(data)]);
      }
    });
  }

  useEffect(() => {
    if (poolsRef) {
      subscribeOnpools();
    }
  }, [poolsRef]);

  function renderPools() {
    return (
      <div className="pools-container">
        {pools.map((pool, idx) => {
          return (
            <Pool
              key={idx}
              pool={mapPool(pool)}
              createPool={createPool}
              updatePool={updatePool}
              deletePool={deletePool}
              userId={userId}
              isManager={isManager}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="right-panel">
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        variant="persistent"
        disablePortal
        ModalProps={{ keepMounted: true }}
        classes={{ paper: "pools-container" }}
        PaperProps={{
          "aria-label": "aria label",
        }}
      >
        <div className="header">
          <h3>Pools</h3>
          <CloseButton onClick={onClose} />
        </div>
        <div className="pools">
          {isManager && (
            <div className="add-new-btn-container">
              <Button
                onClick={addNewPool}
                disabled={
                  !isEmpty(placeholderPool) || pools.length >= poolsLimit
                }
              >
                + Add New Pool
              </Button>
            </div>
          )}
          {!isEmpty(placeholderPool) && (
            <Pool
              pool={placeholderPool}
              isCreateMode
              createPool={createPool}
              userId={userId}
              isManager={isManager}
            />
          )}
          {!isEmpty(pools) && renderPools()}
        </div>
      </Drawer>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.currentUser || {},
  };
};
export default connect(mapStateToProps)(Pools);
