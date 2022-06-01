import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Participant } from "./Participant/Participant";
import classNames from "classnames";
import { checkIsBrokenUser } from "../../App";
import "./participants.scss";

const Participants = (props) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  let participantKey = Object.keys(props.participants);
  const screenPresenter = participantKey.find((element) => {
    const currentParticipant = props.participants[element];
    return currentParticipant.screen;
  });
  const currentUser = props.currentUser
    ? Object.values(props.currentUser)[0]
    : {};

  const containerClassName = classNames(
    `participants members-${participantKey.length}`,
    {
      "has-screen-presenter": screenPresenter,
      "is-current-user-presenter": screenPresenter && currentUser.screen,
      "is-chat-open": props.isChatOpen,
    }
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.stream;
      videoRef.current.muted = true;
    }
  }, [props.currentUser, props.stream]);

  const filteredParticipantKeys = participantKey.filter((id) => {
    return !checkIsBrokenUser(props.participants[id]);
  });
  console.log(filteredParticipantKeys);
  const renderParticipants = filteredParticipantKeys.map((id, index) => {
    const currentParticipant = { ...props.participants[id], id };
    const isCurrentUser = currentParticipant.currentUser;
    if (isCurrentUser) {
      return null;
    }
    const pc = currentParticipant.peerConnection;
    const remoteStream = new MediaStream();
    let curentIndex = index;
    if (pc) {
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        const videElement = document.getElementById(
          `participantVideo${curentIndex}`
        );
        if (videElement) videElement.srcObject = remoteStream;
      };
    }

    return (
      <Participant
        containerRef={containerRef}
        participantKey={participantKey}
        key={curentIndex}
        isScreenPresenter={screenPresenter === id}
        currentParticipant={currentParticipant}
        curentIndex={curentIndex}
        showAvatar={
          !currentParticipant.video &&
          !currentParticipant.screen &&
          currentParticipant.name
        }
        isCurrentTabOpen={props.isCurrentTabOpen}
      />
    );
  });

  return (
    <div
      style={{
        "--members-count": participantKey.length,
      }}
      className={containerClassName}
      ref={containerRef}
    >
      {renderParticipants}
      <Participant
        containerRef={containerRef}
        participantKey={participantKey}
        currentParticipant={currentUser}
        curentIndex={participantKey.length}
        isScreenPresenter={currentUser.screen}
        videoRef={videoRef}
        showAvatar={currentUser && !currentUser.video && !currentUser.screen}
        currentUser={true}
        isCurrentTabOpen={props.isCurrentTabOpen}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    participants: state.participants,
    currentUser: state.currentUser,
    stream: state.mainStream,
  };
};

export default connect(mapStateToProps)(Participants);
