import { IconButton } from "@material-ui/core";
import React from "react";

const DeleteButton = ({ onClick }) => {
  return (
    <IconButton onClick={onClick} className="close-btn">
      x
    </IconButton>
  );
};

export default DeleteButton;
