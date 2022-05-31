import React, { useEffect, useRef, useState } from "react";
import roomRef, { getTimestamp } from "../../server/firebase";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import { connect } from "react-redux";
import { generateId } from "../../App";
import "./chat.scss";
import moment from "moment";
import CloseButton from "../Shared/CloseButton/CloseButton";
import AvatarComponent from "../Shared/Avatar/Avatar";

let timeout;
const chatRef = roomRef.child("chat");
const Chat = ({ user, open, onClose, participants }) => {
  console.log(participants);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const userId = Object.keys(user)[0];
  const currentUser = user[userId];
  const inputRef = useRef(null);

  function changeMessage({ target }) {
    setMessage(target.value);
  }

  function sendMessage(e) {
    e.preventDefault();
    const messageId = generateId();
    chatRef.child(messageId).set({
      senderId: userId,
      id: messageId,
      senderName: currentUser.name,
      message,
      date: getTimestamp(),
    });
    setMessage("");
  }

  function subscribeOnMessages() {
    chatRef.on("value", (snap) => {
      const messageData = snap.val();
      if (messageData) {
        console.log();
        const sortedByDate = Object.values(messageData).sort((a, b) => {
          return moment(a.date).format("X") - moment(b.date).format("X");
        });
        setMessages(sortedByDate);
      }
    });
  }

  function renderMessages({ id, senderName, senderId, message }) {
    const sender = participants.find(
      (participant) => participant.id === senderId
    );
    return (
      <div
        key={id}
        className={`message-container ${senderId === userId ? "me" : ""} `}
      >
        <AvatarComponent size="small" user={sender} maxSymbols={2} />
        <div className="message">{message}</div>
      </div>
    );
  }

  useEffect(() => {
    if (chatRef) {
      subscribeOnMessages();
    }
  }, [chatRef]);

  useEffect(() => {
    if (open) {
      timeout = setTimeout(() => {
        inputRef.current.focus();
      }, 0);
    }
    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <div className="right-panel">
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        variant="persistent"
        disablePortal
        ModalProps={{ keepMounted: true }}
        classes={{ paper: "chat-container" }}
        PaperProps={{
          "aria-label": "aria label",
        }}
      >
        <div className="header">
          <h3>Chat</h3>
          <CloseButton onClick={onClose} />
        </div>
        <div className="messages">{messages.map(renderMessages)}</div>
        <form onSubmit={sendMessage}>
          <TextField
            onChange={changeMessage}
            value={message}
            placeholder="Enter message.."
            size="small"
            variant="outlined"
            type="text"
            fullWidth
            inputProps={{ ref: inputRef }}
            className="message-field"
          />
          <Button type="submit" className="send-btn">
            Send
          </Button>
        </form>
      </Drawer>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.currentUser || {},
  };
};
export default connect(mapStateToProps)(Chat);
