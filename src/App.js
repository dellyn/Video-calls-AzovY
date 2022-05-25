import MainScreen from "./components/MainScreen/MainScreen.component";
import roomRef, { db } from "./server/firebase";
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

export function getRoomId() {
  const urlparams = new URLSearchParams(window.location.search);
  const roomId = urlparams.get("id");
  return roomId;
}

export function generateId() {
  return uuidv4();
}
const connectedRef = db.database().ref(".info/connected");
const participantRef = roomRef.child("participants");

function App(props) {
  const isUserSet = !!props.user;
  const isStreamSet = !!props.stream;
  const [userName, setUserName] = useState(null);

  const getUserStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    return localStream;
  };

  async function initialConnection(params) {
    const stream = await getUserStream();
    stream.getVideoTracks()[0].enabled = false;
    props.setMainStream(stream);

    connectedRef.on("value", (snap) => {
      if (snap.val()) {
        const defaultPreference = {
          audio: true,
          video: false,
          screen: false,
        };
        const userId = generateId();
        const userRef = participantRef.child(userId);
        userRef.set({
          userName,
          id: userId,
          preferences: defaultPreference,
        });
        props.setUser({
          [userRef.key]: { name: userName, id: userId, ...defaultPreference },
        });
        userRef.onDisconnect().remove();
      }
    });
  }

  useEffect(() => {
    if (userName) {
      initialConnection();
    } else {
      const name = prompt("What's your name?");
      setUserName(name);
    }
  }, [userName]);

  useEffect(() => {
    if (isStreamSet && isUserSet) {
      participantRef.on("child_added", (snap) => {
        const preferenceUpdateEvent = participantRef
          .child(snap.key)
          .child("preferences");
        preferenceUpdateEvent.on("child_changed", (preferenceSnap) => {
          props.updateParticipant({
            [snap.key]: {
              [preferenceSnap.key]: preferenceSnap.val(),
            },
          });
        });
        const { userName: name, preferences = {} } = snap.val();
        props.addParticipant({
          [snap.key]: {
            name,
            ...preferences,
          },
        });
      });
      participantRef.on("child_removed", (snap) => {
        props.removeParticipant(snap.key);
      });
    }
  }, [isStreamSet, isUserSet]);

  useEffect(() => {
    const roomId = getRoomId();

    if (!roomId) {
      window.history.replaceState(null, "Meet", "?id=" + roomRef.key);
    }
  }, []);

  return (
    <div className="App">
      <MainScreen />
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
