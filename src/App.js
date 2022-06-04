import MainScreen from "./components/MainScreen/MainScreen";
import roomRef, { db, firepadRef } from "./server/firebase";
import "./App.scss";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import {
  setMainStream,
  addParticipant,
  setUser,
  removeParticipant,
  updateParticipant,
} from "./store/actioncreator";
import { connect } from "react-redux";
import Login from "./components/Login/Login";
import isEmpty from "lodash.isempty";

export const placeholderId = "001";
export function checkIsBrokenUser(user) {
  return (
    !user.hasOwnProperty("id") ||
    !user.name ||
    !user.hasOwnProperty("peerConnection") ||
    !user.hasOwnProperty("audio")
  );
}
export const stringToColour = function (str) {
  if (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = "#";
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff;
      colour += ("00" + value.toString(16)).substr(-2);
    }
    return colour;
  }
};

export function getRoomId() {
  const placeholderId = "001";
  var pathArray = window.location.pathname.split("/");
  return pathArray[1] || placeholderId;
}

export function generateId() {
  return uuidv4();
}
const connectedRef = db.database().ref(".info/connected");
const participantRef = roomRef.child("participants");

function App(props) {
  const [firebaseUser, setFirebaseUser] = useState({});
  const isUserSet = !!props.user;
  const isStreamSet = !!props.stream;
  const [userWasFetched, setUserWasFetched] = useState(false);
  const [roomWasCheked, setRoomWasCheked] = useState(false);
  const [isRoomExist, setIsRoomExist] = useState(false);
  const [wantsToJoin, setWantsToJoin] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const urlId = getRoomId();

  function createRoomById(id) {
    firepadRef.child(id).set({ creator: uuidv4() });
    setRoomId(id);
    setWantsToJoin(true);
  }
  function joinRoom() {
    setWantsToJoin(true);
  }
  const getUserStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    return localStream;
  };
  async function initialConnection() {
    const stream = await getUserStream();
    stream.getVideoTracks()[0].enabled = false;
    props.setMainStream(stream);

    connectedRef.on("value", (snap) => {
      if (snap.val()) {
        const defaultPreference = {
          audio: false,
          video: false,
          screen: false,
        };
        const userId = firebaseUser.uid;
        const userRef = participantRef.child(userId);
        userRef.set({
          userName: firebaseUser.displayName,
          id: userId,
          photoUrl: firebaseUser.photoURL,
          preferences: defaultPreference,
        });
        props.setUser({
          [userId]: {
            name: firebaseUser.displayName,
            photoUrl: firebaseUser.photoURL,
            id: userId,
            ...defaultPreference,
          },
        });

        userRef.onDisconnect().remove();
      }
    });
  }

  function listenAuthChanges() {
    db.auth().onAuthStateChanged((user = {}) => {
      setUserWasFetched(true);
      setFirebaseUser(user || {});
    });
  }

  function subscribeOnParticipantsUpdates() {
    participantRef.on("child_added", (snap) => {
      const userId = snap.val().id;
      const preferenceUpdateEvent = participantRef
        .child(userId)
        .child("preferences");
      preferenceUpdateEvent.on("child_changed", (preferenceSnap) => {
        props.updateParticipant({
          [userId]: {
            [preferenceSnap.key]: preferenceSnap.val(),
          },
        });
      });
      const { userName: name, preferences = {} } = snap.val();
      props.addParticipant({
        [userId]: {
          name,
          id: userId,
          ...preferences,
        },
      });
    });
    participantRef.on("child_removed", (snap) => {
      const userId = snap.val().id;
      props.removeParticipant(userId);
    });
  }

  function checkRoomIsExist(id) {
    setRoomWasCheked(false);
    firepadRef.child(id).on("value", (snap) => {
      const data = snap.val();
      setIsRoomExist(!!data && id !== placeholderId);
      setRoomWasCheked(true);
    });
  }

  useEffect(() => {
    listenAuthChanges();
  }, []);

  useEffect(() => {
    if (!isEmpty(firebaseUser) && isRoomExist && wantsToJoin) {
      initialConnection();
    }
  }, [firebaseUser, isRoomExist, wantsToJoin]);

  useEffect(() => {
    if (isStreamSet && isUserSet && isRoomExist && wantsToJoin) {
      subscribeOnParticipantsUpdates();
    }
  }, [isStreamSet, isUserSet, isRoomExist, wantsToJoin]);

  useEffect(() => {
    if (roomId) {
      checkRoomIsExist(roomId);
    }
  }, [roomId]);

  useEffect(() => {
    if (urlId && urlId !== placeholderId) {
      checkRoomIsExist(urlId);
    }
  }, [urlId]);

  return (
    <div className="App">
      {isRoomExist && wantsToJoin ? (
        <MainScreen />
      ) : (
        <Login
          user={props.user}
          firebaseUser={firebaseUser}
          setFirebaseUser={setFirebaseUser}
          createRoomById={createRoomById}
          joinRoom={joinRoom}
          isRoomExist={isRoomExist}
          roomWasCheked={roomWasCheked}
          urlId={urlId}
          userWasFetched={userWasFetched}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    stream: state.mainStream,
    user: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    addParticipant: (user) => dispatch(addParticipant(user)),
    setUser: (user) => dispatch(setUser(user)),
    removeParticipant: (userId) => dispatch(removeParticipant(userId)),
    updateParticipant: (user) => dispatch(updateParticipant(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
