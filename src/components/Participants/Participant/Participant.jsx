import React from "react";
import classNames from "classnames";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import AvatarComponent from "../../Shared/Avatar/Avatar";
import "./participant.scss";

export const Participant = (props) => {
  const {
    isScreenPresenter,
    curentIndex,
    currentParticipant,
    videoRef,
    showAvatar,
    currentUser,
    isCurrentTabOpen,
  } = props;

  const containerClassName = classNames("participant", {
    "is-screen-presenter": isScreenPresenter,
    "is-current-user": currentUser,
    "is-current-tab-open": isCurrentTabOpen,
    "has-video": currentParticipant.video,
    "no-video": !currentParticipant.video && !currentParticipant.screen,
    "has-screen": currentParticipant.screen,
    "has-audio": currentParticipant.audio,
  });

  const videoClassName = classNames("video", {
    "screen-presenter-video": isScreenPresenter,
  });

  if (!currentParticipant) return <></>;

  return (
    <div className={containerClassName}>
      <div className="card">
        <video
          ref={videoRef}
          className={videoClassName}
          id={`participantVideo${curentIndex}`}
          autoPlay
          playsInline
        ></video>
        {showAvatar && (
          <AvatarComponent
            user={currentParticipant}
            currentUser={currentUser}
          />
        )}
        <div className="user-info-container">
          <div className="name">{currentParticipant.name}</div>
          {!currentParticipant.audio ? (
            <MicOffIcon className="mic-icon muted" aria-hidden />
          ) : (
            <MicIcon className="mic-icon un-muted" aria-hidden />
          )}
        </div>
        <div className="layout"></div>
      </div>
    </div>
  );
};
