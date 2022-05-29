import React from "react";
import Card from "../../Shared/Card/Card.component";
import "./Participant.scss";
import classNames from "classnames";
import { stringToColour } from "../../../App";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";

function getGridStyle(participantKey, width) {
  let maxWidth = 800;
  if (participantKey.length <= 2) {
    return {
      participantsInRow: 1,
      widthPadding: 16,
      participantsRows: 1,
      heightPadding: 0,
      maxWidth: null,
    };
  }
  if (participantKey.length <= 4) {
    return {
      participantsInRow: 2,
      widthPadding: 32,
      participantsRows: 2,
      heightPadding: 16,
      maxWidth,
    };
  }
  if (participantKey.length === 5) {
    return {
      participantsInRow: 3,
      widthPadding: 32,
      participantsRows: 2,
      heightPadding: 16,
      maxWidth,
    };
  }
  if (participantKey.length === 6) {
    return {
      participantsInRow: 3,
      widthPadding: 32,
      participantsRows: 2,
      heightPadding: 16,
      maxWidth,
    };
  }
  if (participantKey.length <= 8) {
    return {
      participantsInRow: 4,
      widthPadding: 32,
      participantsRows: 2,
      heightPadding: 16,
      maxWidth,
    };
  }
  if (participantKey.length === 9) {
    return {
      participantsInRow: 3,
      widthPadding: 32,
      participantsRows: 3,
      heightPadding: 16,
    };
  }
  return {};
}
export const Participant = (props) => {
  const {
    containerRef,
    participantKey,
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
  });

  if (!currentParticipant) return <></>;

  return (
    <div className={containerClassName}>
      <Card>
        <video
          ref={videoRef}
          className={`video ${
            isScreenPresenter ? "screen-presenter-video" : ""
          }`}
          id={`participantVideo${curentIndex}`}
          autoPlay
          playsInline
        ></video>

        {showAvatar && (
          <div
            style={{ background: stringToColour(currentParticipant.id) }}
            className="avatar"
          >
            {currentParticipant?.name ? currentParticipant.name[0] : ""}
          </div>
        )}
        <div className="user-info-container">
          {!currentParticipant.audio && (
            <MicOffIcon className="muted-icon" aria-hidden />
          )}
          <div className="name">
            {currentUser ? "You" : currentParticipant.name}
          </div>
        </div>
      </Card>
      <div className="layout"></div>
    </div>
  );
};
