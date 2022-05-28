import React, { useState, useRef, useEffect } from "react";
import MeetingFooter from "../MeetingFooter/MeetingFooter.component";
import Participants from "../Participants/Participants.component";
import { connect } from "react-redux";
import { setMainStream, updateUser } from "../../store/actioncreator";
import Chat from "../Chat/Chat";
import Pools from "../Pools/Pools";
import "./MainScreen.scss";
import useNotification from "../../hooks/useNotification";

const MainScreen = (props) => {
  const participantRef = useRef(props.participants);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPoolsOpen, setIsPoolsOpen] = useState(true);

  const onMicClick = (micEnabled) => {
    if (props.stream) {
      props.stream.getAudioTracks()[0].enabled = micEnabled;
      props.updateUser({ audio: micEnabled });
    }
  };
  const onVideoClick = (videoEnabled) => {
    if (props.stream) {
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

  const onScreenShareEnd = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    localStream.getVideoTracks()[0].enabled = Object.values(
      props.currentUser
    )[0].video;

    updateStream(localStream);

    props.updateUser({ screen: false });
  };

  const onScreenClick = async () => {
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

    mediaStream.getVideoTracks()[0].onended = onScreenShareEnd;

    updateStream(mediaStream);

    props.updateUser({ screen: true });
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
  return (
    <div className="wrapper">
      <div className="main-screen">
        <Participants isChatOpen={isChatOpen || isPoolsOpen} />
      </div>

      <div className="footer">
        <MeetingFooter
          onScreenClick={onScreenClick}
          onMicClick={onMicClick}
          onVideoClick={onVideoClick}
          openChat={openChat}
          openPools={openPools}
          hasChatNotification={hasChatNotification}
          hasPoolsNotification={hasPoolsNotification}
        />
      </div>
      <Chat open={isChatOpen} onClose={closeChat} />
      <Pools open={isPoolsOpen} onClose={closePools} />
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
