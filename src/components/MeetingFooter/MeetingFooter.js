import React, { useEffect } from "react";
import ReactTooltip from "react-tooltip";
import BarChartIcon from "@material-ui/icons/BarChart";
import ChatIcon from "@material-ui/icons/Chat";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import classNames from "classnames";
import "./meetingFooter.scss";

const MeetingFooter = (props) => {
  const {
    streamState,
    setStreamState,
    isSomeoneOtherShareScreen,
    openChat,
    openPools,
    isChatOpen,
    isPoolsOpen,
  } = props;
  const screenIconClassName = classNames("meeting-icons screen", {
    active: streamState.screen,
    disabled: isSomeoneOtherShareScreen,
  });

  function getScreenIconLabel() {
    if (isSomeoneOtherShareScreen) {
      return "You cant start screen share until other member stop to present the screen";
    }
    return streamState.screen ? "Stop Share" : "Share Screen";
  }

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
        className={"meeting-icons mic " + (streamState.mic ? "active" : "")}
        data-tip={streamState.mic ? "Mute Audio" : "Unmute Audio"}
        onClick={micClick}
      >
        {streamState.mic ? <MicIcon /> : <MicOffIcon />}
      </div>
      <div
        className={"meeting-icons video " + (streamState.video ? "active" : "")}
        data-tip={streamState.video ? "Hide Video" : "Show Video"}
        onClick={onVideoClick}
      >
        {streamState.video ? <VideocamIcon /> : <VideocamOffIcon />}
      </div>
      <div
        className={screenIconClassName}
        data-tip={getScreenIconLabel()}
        onClick={onScreenClick}
      >
        {isSomeoneOtherShareScreen && !streamState.screen ? (
          <StopScreenShareIcon aria-hidden />
        ) : (
          <ScreenShareIcon aria-hidden />
        )}
      </div>
      <div className="notification-icon-container">
        <div
          className={`meeting-icons chat ${isChatOpen ? "active" : ""}`}
          onClick={openChat}
          data-tip={"Chat"}
        >
          {props.hasChatNotification && (
            <div className="notification-icon"></div>
          )}
          <ChatIcon aria-hidden />
        </div>
      </div>
      <div className="notification-icon-container">
        <div
          className={`meeting-icons pools ${isPoolsOpen ? "active" : ""}`}
          data-tip={"Pools"}
          onClick={openPools}
        >
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
