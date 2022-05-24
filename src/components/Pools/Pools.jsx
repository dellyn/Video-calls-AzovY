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

const poolsRef = roomRef.child("pools");
const Pools = ({ user, open, onClose }) => {
  const [pools, setPools] = useState([]);
  const userId = Object.keys(user)[0];
  const currentUser = user[userId];

  function createPool(pool) {
    const poolId = generateId();
    poolsRef.child(poolId).set({
      id: poolId,
      creatorId: userId,
      creator: currentUser.name,
      date: getTimestamp(),
      ...pool,
    });
    setPools([...pools, pool]);
  }
  function updatePool(updatedPool) {
    const updatedPools = pools.map((pool) => {
      if (updatedPool.id === pool.id) {
        return updatedPool;
      }
      return pool;
    });
    setPools(updatedPools);
  }

  function subscribeOnpools() {
    poolsRef.on("value", (snap) => {
      const data = snap.val();
      if (data) {
        setPools(data);
      }
    });
  }

  function renderPools() {
    if (isEmpty(pools)) {
      return <Pool createPool={createPool} />;
    }
    return (
      <div className="">
        {pools.map((pool, idx) => {
          return (
            <Pool
              key={idx}
              pool={pool}
              createPool={createPool}
              updatePool={updatePool}
            />
          );
        })}
      </div>
    );
  }

  useEffect(() => {
    if (poolsRef) {
      subscribeOnpools();
    }
  }, [poolsRef]);

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
          <IconButton onClick={onClose}>close</IconButton>
        </div>
        <div className="pools">{renderPools()}</div>
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
