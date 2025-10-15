import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Button,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import { getWithdrawalsById } from "../services"; // Suponiendo que tienes este servicio

export default function PrescriptionListDialog({
  open,
  handleClose,
  patientId,
}) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && patientId) {
      setLoading(true);
      getWithdrawalsById(patientId)
        .then((data) => {
          setPrescriptions(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching prescriptions:", error);
          setLoading(false);
        });
    }
  }, [open, patientId]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Retiros Registrados</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {prescriptions.length ? (
              prescriptions.map((prescription) => (
                <ListItem key={prescription.id} divider>
                  <ListItemText
                    primary={`Medicamento Retirado: ${JSON.parse(
                      prescription.medication
                    )
                      .map((medication, index) => medication)
                      .join(", ")}`}
                    secondary={`Fecha del Retiro: ${new Date(
                      prescription.withdrawal_date
                    ).toLocaleDateString()}`}
                  />                 
                </ListItem>
              ))
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Typography variant="subtitle1">
                  Sin Retiros Recientes
                </Typography>
              </Box>
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
