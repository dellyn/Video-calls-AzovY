import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { stringToColour } from "../../../App";
import "./avatar.scss";
import classNames from "classnames";

function getInitials(name, maxSymbols) {
  if (!name) return "";
  const splitted = name.split(" ");
  let firstLetter;
  let secondLetter;

  if (splitted.length > 1) {
    firstLetter = splitted[0].substr(0, 1);
    secondLetter = splitted[1].substr(0, 1);
  } else {
    firstLetter = splitted[0].substr(0, 1);
    secondLetter = "";
  }
  const letters = `${firstLetter}${secondLetter}`;
  const initials =
    name.length <= 3 && maxSymbols >= name.length ? name : letters;
  return initials.toUpperCase();
}

const AvatarComponent = ({
  user = {},
  name,
  size,
  currentUser,
  maxSymbols,
}) => {
  const containerClassName = classNames("avatar", size);
  return (
    <Avatar
      classes={{ root: containerClassName }}
      style={{ background: stringToColour(user.id) }}
      src={user.avatar}
    >
      {currentUser ? "You" : getInitials(user.name, maxSymbols)}
    </Avatar>
  );
};

export default AvatarComponent;
