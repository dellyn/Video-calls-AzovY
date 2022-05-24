import React, { useEffect } from "react";
import Card from "../../Shared/Card/Card.component";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Participant.css";
import classNames from "classnames";

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
  } = props;

  const containerClassName = classNames("participant", {
    "is-screen-presenter": isScreenPresenter,
    "is-current-user": currentUser,
  });

  const minWidth = 330;
  const { width, height } = containerRef.current?.getBoundingClientRect() || {};
  const { participantsInRow, widthPadding, participantsRows, heightPadding } =
    getGridStyle(participantKey, width);

  function getNumOfRows() {
    return Math.round((participantKey.length * minWidth) / width);
  }

  if (!currentParticipant) return <></>;

  return (
    <div
      className={containerClassName}
      // style={{
      //   width: `calc(100% / ${participantsInRow} - ${widthPadding}px)`,
      //   "max-width": `calc(100% / ${participantsInRow} - ${widthPadding}px)`,
      //   // "max-width": maxWidth,
      //   "min-width": `${minWidth}px`,
      //   height: `cauto`,
      //   "max-height": `calc(100% / ${participantsRows} - ${heightPadding}px)`,
      // }}
    >
      <Card>
        <video
          ref={videoRef}
          className="video"
          id={`participantVideo${curentIndex}`}
          autoPlay
          playsInline
        ></video>
        {!currentParticipant.audio && (
          <FontAwesomeIcon
            className="muted"
            icon={faMicrophoneSlash}
            title="Muted"
          />
        )}
        {showAvatar && (
          <div
            style={{ background: currentParticipant.avatarColor }}
            className="avatar"
          >
            {currentParticipant?.name ? currentParticipant.name[0] : ""}
          </div>
        )}
        <div className="name">
          {currentParticipant.name}
          {currentUser ? "(You)" : ""}
        </div>
      </Card>
    </div>
  );
};
