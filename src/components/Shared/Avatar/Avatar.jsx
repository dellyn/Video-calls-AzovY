import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { stringToColour } from "../../../App";

const AvatarComponent = (user) => {
  if (!user) return;
  return (
    <Avatar
      classes={{ root: "signer-avatar" }}
      style={{ borderColor: stringToColour(user.id) }}
    >
      {user.userName[0]}
    </Avatar>
  );
};

export default AvatarComponent;
