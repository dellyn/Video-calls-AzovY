import { IconButton } from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";

const CloseButton = ({ onClick }) => {
  return (
    <IconButton onClick={onClick} className="close-btn" aria-label="Close">
      <CloseIcon aria-hidden />
    </IconButton>
  );
};

export default CloseButton;
