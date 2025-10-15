import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import logo from "../assets/img/logo.png";

const Header = () => {
  const [dateTime, setDateTime] = useState({
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString("es-ES", { hour12: false }),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString("es-ES", { hour12: false }),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: "300px",
        minHeight: "80px",
        pl: 2,
        pr: 2,
        boxSizing: "border-box",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        "&:after": {
          content: '""',
          position: "absolute",
          width: 210,
          height: 210,
          background: "#258786",
          borderRadius: "50%",
          top: { xs: -105, sm: -85 },
          right: { xs: -140, sm: -95 },
          zIndex: 0,
        },
        "&:before": {
          content: '""',
          position: "absolute",
          width: 210,
          height: 210,
          background: "#258786",
          borderRadius: "50%",
          top: { xs: -155, sm: -125 },
          right: { xs: -70, sm: -15 },
          opacity: 0.5,
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ zIndex: 1 }}>
        <img src={logo} alt="Logo" style={{ height: "70px", width: "70px" }} />
      </Box>
      <Box sx={{ zIndex: 1 }}>
        <Typography variant="body1" sx={{ color: "white", textAlign: "right" }}>
          Fecha: <b>{dateTime.date}</b>
        </Typography>
        <Typography variant="body2" sx={{ color: "white", textAlign: "right" }}>
          Hora: <b>{dateTime.time}</b>
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
