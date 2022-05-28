import { useEffect, useState } from "react";
import roomRef from "../server/firebase";
const chatRef = roomRef.child("chat");
const poolsRef = roomRef.child("pools");

const useNotification = (props = {}) => {
  const { isChatOpen, isPoolsOpen } = props;
  const [hasChatNotification, setHasChatNotification] = useState(false);
  const [wasSubscribedOnChat, setWasSubscribedOnChat] = useState(false);

  const [hasPoolsNotification, setHasPoolsNotification] = useState(false);
  const [wasSubscribedOnPools, setWasSubscribedOnPools] = useState(false);

  function subcscribeOnChat() {
    setWasSubscribedOnChat(true);
    chatRef.on("value", (snap) => {
      const data = snap.val();
      if (data && !isChatOpen) {
        setHasChatNotification(true);
      } else {
        setHasChatNotification(false);
      }
    });
  }

  function subcscribeOnPools() {
    setWasSubscribedOnPools(true);
    poolsRef.on("value", (snap) => {
      const data = snap.val();
      if (data && !isPoolsOpen) {
        setHasPoolsNotification(true);
      } else {
        setHasPoolsNotification(false);
      }
    });
  }

  useEffect(() => {
    if (chatRef) {
      subcscribeOnChat();
    }
  }, [chatRef, wasSubscribedOnChat, isChatOpen]);

  useEffect(() => {
    if (poolsRef) {
      subcscribeOnPools();
    }
  }, [poolsRef, wasSubscribedOnPools, isPoolsOpen]);

  useEffect(() => {
    setHasChatNotification(false);
  }, [isChatOpen]);

  useEffect(() => {
    setHasPoolsNotification(false);
  }, [isPoolsOpen]);

  return { hasChatNotification, hasPoolsNotification };
};

export default useNotification;
