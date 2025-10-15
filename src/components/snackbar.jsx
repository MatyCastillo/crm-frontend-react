import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

export default function TransitionAlerts({ open, setOpen, title,type }) {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer if the component is unmounted
    }
  }, [open, setOpen]);

  // severity="success"
  //  severity="info"
  //  severity="warning"
  //  severity="error"

  return (
    <Box sx={{ width: "100%" }}>
      <Collapse in={open}>
        <Alert
        severity={type}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {title}
        </Alert>
      </Collapse>
    </Box>
  );
}
