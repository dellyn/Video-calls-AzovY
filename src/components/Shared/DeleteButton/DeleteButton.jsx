import { IconButton } from "@material-ui/core";
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";

const DeleteButton = ({ onClick, className = "delete-btn" }) => {
  return (
    <IconButton size="small" onClick={onClick} className={className}>
      <DeleteIcon aria-hidden />
    </IconButton>
  );
};

export default DeleteButton;
