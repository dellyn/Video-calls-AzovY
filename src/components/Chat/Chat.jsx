import React, { useEffect, useState } from "react";
import roomRef, { getTimestamp } from "../../server/firebase";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import { connect } from "react-redux";
import { generateId } from "../../App";
import "./chat.scss";
import moment from "moment";
import { IconButton } from "@material-ui/core";

const chatRef = roomRef.child("chat");
const Chat = ({ user, open, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const userId = Object.keys(user)[0];
  const currentUser = user[userId];

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
      avatarColor: currentUser.avatarColor,
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

  function renderMessages({ id, senderName, senderId, message, avatarColor }) {
    return (
      <div
        key={id}
        className={`message-container ${senderId === userId ? "me" : ""} `}
      >
        <div style={{ background: avatarColor }} className="avatar">
          {senderName}
        </div>
        <div className="message">{message}</div>
      </div>
    );
  }

  useEffect(() => {
    if (chatRef) {
      subscribeOnMessages();
    }
  }, [chatRef]);

  return (
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
        <IconButton onClick={onClose}>close</IconButton>
      </div>
      <div className="messages">{messages.map(renderMessages)}</div>
      <form onSubmit={sendMessage}>
        <TextField
          onChange={changeMessage}
          value={message}
          size="small"
          variant="outlined"
          type="text"
          fullWidth
        />
        <Button type="submit">Send</Button>
      </form>
    </Drawer>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.currentUser || {},
  };
};
export default connect(mapStateToProps)(Chat);
