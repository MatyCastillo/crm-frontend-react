import React from "react";
import { Box, Typography } from "@mui/material";
import { formatCurrency } from "../utils/numberFormat";


export default function SmallInfoBox({ title, total, color }) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "100px",
        maxHeight: "80px",
        padding: 2,
        backgroundColor: "white",
        border: `0.5px solid #ccc`,
        borderRadius: "8px",
        boxSizing: "border-box",
        overflow: "hidden",
        "&:after": {
          content: '""',
          position: "absolute",
          width: 150,
          height: 150,
          background: color,
          borderRadius: "50%",
          top: { xs: -105, sm: -85 },
          right: { xs: -140, sm: -95 },
          opacity: 0.5,
          zIndex: 0,
        },
        "&:before": {
          content: '""',
          position: "absolute",
          width: 150,
          height: 150,
          background: color,
          borderRadius: "50%",
          top: { xs: -155, sm: -125 },
          right: { xs: -70, sm: -15 },
          opacity: 0.2,
          zIndex: 0,
        },
      }}
    >
      <Typography variant="button" sx={{ zIndex: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ zIndex: 1 }}>
        {formatCurrency(total)}
      </Typography>
    </Box>
  );
}
