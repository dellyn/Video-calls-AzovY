import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import BarChartIcon from "@material-ui/icons/BarChart";
import ChatIcon from "@material-ui/icons/Chat";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import "./MeetingFooter.scss";

const MeetingFooter = (props) => {
  const { streamState, setStreamState } = props;

  const micClick = () => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        mic: !currentState.mic,
      };
    });
  };

  const onVideoClick = () => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        video: !currentState.video,
      };
    });
  };

  const onScreenClick = () => {
    props.onScreenClick(streamState.screen);
  };

  useEffect(() => {
    props.onMicClick(streamState.mic);
  }, [streamState.mic]);

  useEffect(() => {
    props.onVideoClick(streamState.video);
  }, [streamState.video]);

  return (
    <div className="meeting-footer">
      <div
        className={"meeting-icons " + (streamState.mic ? "active" : "")}
        data-tip={streamState.mic ? "Mute Audio" : "Unmute Audio"}
        onClick={micClick}
      >
        {streamState.mic ? <MicIcon /> : <MicOffIcon />}
      </div>
      <div
        className={"meeting-icons " + (streamState.video ? "active" : "")}
        data-tip={streamState.video ? "Hide Video" : "Show Video"}
        onClick={onVideoClick}
      >
        {streamState.video ? <VideocamIcon /> : <VideocamOffIcon />}
      </div>
      <div
        className={"meeting-icons " + (streamState.screen ? "active" : "")}
        data-tip="Share Screen"
        onClick={onScreenClick}
      >
        <ScreenShareIcon aria-hidden />
      </div>
      <div className="notification-icon-container">
        <div className="meeting-icons" onClick={props.openChat}>
          {props.hasChatNotification && (
            <div className="notification-icon"></div>
          )}
          <ChatIcon aria-hidden />
        </div>
      </div>
      <div className="notification-icon-container">
        <div className="meeting-icons" onClick={props.openPools}>
          {props.hasPoolsNotification && (
            <div className="notification-icon"></div>
          )}
          <BarChartIcon aria-hidden />
        </div>
      </div>
      <ReactTooltip />
    </div>
  );
};

export default MeetingFooter;
