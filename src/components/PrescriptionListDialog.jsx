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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { fetchPatientPrescriptions } from "../services"; // Suponiendo que tienes este servicio

export default function PrescriptionListDialog({
  open,
  handleClose,
  patientId,
}) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (open && patientId) {
      setLoading(true);
      fetchPatientPrescriptions(patientId)
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

  const handleViewImage = (imagePath) => {
    console.log("imagen path", `http://localhost:8080/${imagePath}`);
    setSelectedImage(imagePath);
  };

  const handleCloseImageDialog = () => {
    setSelectedImage(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Recetas del Paciente</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {prescriptions.length ? (
              prescriptions.map((prescription) => (
                <ListItem key={prescription.id} divider>
                  <ListItemText
                    primary={
                      <>
                        Medicamento Recetado:{" "}
                        {JSON.parse(prescription.medication)}
                        <br />
                        Medicamento No Recetado:{" "}
                        {JSON.parse(prescription.medication_added)
                          ? JSON.parse(prescription.medication_added)
                          : "Sin agregados"}
                      </>
                    }
                    secondary={`Fecha de Emisión: ${new Date(
                      prescription.issue_date
                    ).toLocaleDateString()}`}
                  />

                  <Tooltip title="Ver Receta">
                    <IconButton
                      color="primary"
                      edge="end"
                      onClick={() =>
                        handleViewImage(prescription.prescription_image)
                      }
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
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
                  Sin Recetas Agregadas
                </Typography>
              </Box>
            )}
          </List>
        )}
      </DialogContent>
      {/* Mostrar la imagen de la receta en otro diálogo */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onClose={handleCloseImageDialog}
          maxWidth="md"
        >
          <DialogContent>
            <img
              src={`http://localhost:8080/${selectedImage}`} // Ajusta la ruta según tu configuración de servidor
              alt="Receta"
              style={{ width: "100%" }}
            />
          </DialogContent>
          <Button onClick={handleCloseImageDialog} color="error">
            Cerrar
          </Button>
        </Dialog>
      )}
    </Dialog>
  );
}
