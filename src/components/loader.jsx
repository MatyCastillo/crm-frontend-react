import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, CircularProgress } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Loader(prop) {
  return (
    <div>
      <Dialog
        open={prop.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={prop.close}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{prop.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {prop.message}
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "200px",
              height: "25px",
            }}
          ></Box>
        </DialogContent>
        <DialogActions>
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "10px",
              marginLeft: "-12px",
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}
