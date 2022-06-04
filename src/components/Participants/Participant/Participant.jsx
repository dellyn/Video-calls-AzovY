import React from "react";
import classNames from "classnames";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import AvatarComponent from "../../Shared/Avatar/Avatar";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import PhotoSizeSelectSmallIcon from "@material-ui/icons/PhotoSizeSelectSmall";
import "./participant.scss";
import { GRID_THEMES } from "../Participants";

export const Participant = (props) => {
  const {
    isScreenPresenter,
    curentIndex,
    currentParticipant,
    videoRef,
    showAvatar,
    isCurrentUser,
    isCurrentTabOpen,
    gridTheme,
    setGridTheme,
  } = props;

  const containerClassName = classNames("participant", {
    "is-screen-presenter": isScreenPresenter,
    "is-current-user": isCurrentUser,
    "is-current-tab-open": isCurrentTabOpen,
    "has-video": currentParticipant.video,
    "no-video": !currentParticipant.video && !currentParticipant.screen,
    "has-screen": currentParticipant.screen,
    "has-audio": currentParticipant.audio,
  });

  const videoClassName = classNames("video", {
    "screen-presenter-video": isScreenPresenter,
  });

  function changeGridTheme() {
    if (gridTheme === GRID_THEMES.EQUAL) {
      setGridTheme(GRID_THEMES.GUEST_FIRST);
    } else {
      setGridTheme(GRID_THEMES.EQUAL);
    }
  }

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
        {showAvatar && <AvatarComponent user={currentParticipant} />}
        {isCurrentUser && (
          <div className="user-actions">
            <div
              className={"meeting-icons change-grid-icon"}
              onClick={changeGridTheme}
            >
              {gridTheme === GRID_THEMES.EQUAL ? (
                <PhotoSizeSelectSmallIcon />
              ) : (
                <FullscreenIcon />
              )}
            </div>
          </div>
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
