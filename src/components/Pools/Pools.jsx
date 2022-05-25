import React, { useEffect, useState } from "react";
import roomRef, { getTimestamp } from "../../server/firebase";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import { connect } from "react-redux";
import { generateId } from "../../App";
import { IconButton } from "@material-ui/core";
import isEmpty from "lodash.isempty";
import Pool from "./Pool/Pool";
import CloseButton from "../Shared/CloseButton/CloseButton";
import "./pools.scss";

const poolsRef = roomRef.child("pools");
const defaultQuestions = [
  {
    option: "Option 1",
    id: 0,
  },
  {
    option: "Option 2",
    id: 1,
  },
  {
    option: "Option 3",
    id: 2,
  },
];
export const defaultPool = {
  title: "",
  description: "",
  questions: defaultQuestions,
  questionsType: "checkbox",
  id: null,
};

const Pools = ({ user, open, onClose }) => {
  const [pools, setPools] = useState([]);
  const [placeholderPool, setPlaceholderPool] = useState({});
  const userId = Object.keys(user)[0];
  const isManager = true;
  const poolsLimit = 1;

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
  }

  function addNewPool() {
    setPlaceholderPool(defaultPool);
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
      <div className="">
        {pools.map((pool, idx) => {
          return (
            <Pool
              key={idx}
              pool={pool}
              createPool={createPool}
              updatePool={updatePool}
              userId={userId}
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
