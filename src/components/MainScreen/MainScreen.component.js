import React, { useState, useRef, useEffect } from "react";
import MeetingFooter from "../MeetingFooter/MeetingFooter.component";
import Participants from "../Participants/Participants.component";
import { connect } from "react-redux";
import { setMainStream, updateUser } from "../../store/actioncreator";
import Chat from "../Chat/Chat";
import Pools from "../Pools/Pools";
import "./MainScreen.scss";
import useNotification from "../../hooks/useNotification";
import { checkIsBrokenUser } from "../../App";

const MainScreen = (props) => {
  const arr = Object.entries(props.participants);
  const filtered = arr.filter(([key, value]) => checkIsBrokenUser(value));
  const participantRef = useRef(filtered);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPoolsOpen, setIsPoolsOpen] = useState(false);
  const [isCurrentTabOpen, setIsCurrentTabOpen] = useState(true);
  const [streamState, setStreamState] = useState({
    mic: false,
    video: false,
    screen: false,
  });
  const isSomeoneOtherShareScreen = Object.values(participantRef.current).some(
    (user) => user.screen && user.id !== props.currentUser.id
  );

  const onMicClick = (micEnabled) => {
    if (props.stream && props.stream.getAudioTracks()[0]) {
      props.stream.getAudioTracks()[0].enabled = micEnabled;
      props.updateUser({ audio: micEnabled });
    }
  };
  const onVideoClick = (videoEnabled) => {
    if (props.stream && props.stream.getAudioTracks()[0]) {
      props.stream.getVideoTracks()[0].enabled = videoEnabled;
      props.updateUser({ video: videoEnabled });
    }
  };

  useEffect(() => {
    participantRef.current = props.participants;
  }, [props.participants]);

  const updateStream = (stream) => {
    for (let key in participantRef.current) {
      const sender = participantRef.current[key];
      if (sender.currentUser) continue;
      const peerConnection = sender.peerConnection
        .getSenders()
        .find((s) => (s.track ? s.track.kind === "video" : false));
      peerConnection.replaceTrack(stream.getVideoTracks()[0]);
    }
    props.setMainStream(stream);
  };

  const setScreenState = (isEnabled) => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        screen: isEnabled,
      };
    });
  };

  const handleScreenShareEnd = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    localStream.getVideoTracks()[0].enabled = Object.values(
      props.currentUser
    )[0].video;

    updateStream(localStream);
    setScreenState(false);

    props.updateUser({ screen: false });
  };
  function stopSharing() {
    const videoElem = document.querySelector(".screen-presenter-video");
    if (videoElem) {
      const tracks = videoElem.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoElem.srcObject = null;
    }
    handleScreenShareEnd();
  }

  const onScreenClick = async () => {
    if (streamState.screen) {
      stopSharing();
    } else if (!isSomeoneOtherShareScreen) {
      let mediaStream;
      if (navigator.getDisplayMedia) {
        mediaStream = await navigator.getDisplayMedia({ video: true });
      } else if (navigator.mediaDevices.getDisplayMedia) {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
      } else {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { mediaSource: "screen" },
        });
      }

      mediaStream.getVideoTracks()[0].onended = handleScreenShareEnd;
      updateStream(mediaStream);
      setScreenState(true);
      props.updateUser({ screen: true });
    }
  };

  function openChat() {
    setIsChatOpen(!isChatOpen);
    setIsPoolsOpen(false);
  }
  function openPools() {
    setIsPoolsOpen(!isPoolsOpen);
    setIsChatOpen(false);
  }
  function closePools() {
    setIsPoolsOpen(false);
  }
  function closeChat() {
    setIsChatOpen(false);
  }
  const { hasChatNotification, hasPoolsNotification } = useNotification({
    isChatOpen,
    isPoolsOpen,
  });

  document.addEventListener("visibilitychange", function (event) {
    if (document.hidden) {
      setIsCurrentTabOpen(false);
    } else {
      setIsCurrentTabOpen(true);
    }
  });

  return (
    <div className="wrapper">
      <div className="main-screen">
        <Participants
          streamState={streamState}
          isChatOpen={isChatOpen || isPoolsOpen}
          isCurrentTabOpen={isCurrentTabOpen}
        />
      </div>
      <div className="footer">
        <MeetingFooter
          streamState={streamState}
          setStreamState={setStreamState}
          onScreenClick={onScreenClick}
          onMicClick={onMicClick}
          onVideoClick={onVideoClick}
          openChat={openChat}
          openPools={openPools}
          hasChatNotification={hasChatNotification}
          hasPoolsNotification={hasPoolsNotification}
          isChatOpen={isChatOpen}
          isPoolsOpen={isPoolsOpen}
          isSomeoneOtherShareScreen={isSomeoneOtherShareScreen}
        />
      </div>
      <Chat
        open={isChatOpen}
        onClose={closeChat}
        participants={Object.values(participantRef.current) || []}
      />
      <Pools
        open={isPoolsOpen}
        onClose={closePools}
        participants={Object.values(participantRef.current) || []}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    stream: state.mainStream,
    participants: state.participants,
    currentUser: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    updateUser: (user) => dispatch(updateUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
