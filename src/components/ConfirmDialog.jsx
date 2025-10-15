import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ConfirmDialog = ({
  open,
  onClose,
  title,
  description,
  actionButton = "Confirmar",
  actionButtonColor = "inherit",
  onAction,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">¿{title}?</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color={actionButtonColor} onClick={onAction} autoFocus>
          {actionButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
