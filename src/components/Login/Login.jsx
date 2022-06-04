import React, { useState } from "react";
import { db } from "../../server/firebase";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./login.scss";
import { placeholderId } from "../../App";

const Login = ({
  firebaseUser,
  createRoomById,
  isRoomExist,
  joinRoom,
  roomWasCheked,
  urlId,
  userWasFetched,
}) => {
  const [isFetchingUser, setIsFetchingUser] = useState(null);
  const navigate = useHistory();

  function handleCrateRoomAndJoin() {
    const id = uuidv4();
    navigate.push(id);
    createRoomById(id);
  }
  async function signIn() {
    setIsFetchingUser(true);
    setIsFetchingUser(false);
    const prov = new db.auth.GoogleAuthProvider();
    await db
      .auth()
      .signInWithPopup(prov)
      .then((res) => {
        setIsFetchingUser(false);
      })
      .catch((err) => {
        setIsFetchingUser(false);
      });
  }

  function signOut() {
    db.auth().signOut();
  }

  return (
    <div className="login container">
      <div className="wrapper">
        <h1>Welcome to the Azovy video app</h1>
        <div className="description">Are you ready to start the meeting?</div>
        {firebaseUser.uid ? (
          <>
            <Button onClick={signOut}>Sign out</Button>
            {urlId !== placeholderId && (isRoomExist || !roomWasCheked) ? (
              <Button onClick={joinRoom} disabled={!roomWasCheked}>
                Join Meeting
              </Button>
            ) : (
              <Button onClick={handleCrateRoomAndJoin}>Start Meeting</Button>
            )}
          </>
        ) : (
          <Button onClick={signIn} disabled={!userWasFetched || isFetchingUser}>
            Get started
          </Button>
        )}
      </div>
    </div>
  );
};

export default Login;
