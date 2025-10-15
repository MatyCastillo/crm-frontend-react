import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ConfirmDialog from "./ConfirmDialog"; // Asegúrate de ajustar la ruta de importación según tu estructura
import {
  elegiblePrescriptions,
  markWithdrawal,
  registerWithdrawal,
} from "../services";
import {
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import VisibilityIcon from "@mui/icons-material/Visibility";

const WithdrawalListDialog = ({ open, onClose, patientId }) => {
  const [prescriptions, setPrescriptions] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchPrescriptions = async (patientId) => {
    try {
      const prescriptions = await elegiblePrescriptions(patientId);
      setPrescriptions(prescriptions);
      setLoading(false);
    } catch (err) {
      console.log("Error al obtener las recetas", err);
    }
  };

  useEffect(() => {
    if (open && patientId) {
      setLoading(true);
      fetchPrescriptions(patientId);
    }
  }, [open, patientId]);

  const handleViewImage = (imagePath) => {
    console.log("imagen path", `http://localhost:8080/${imagePath}`);
    setSelectedImage(imagePath);
  };

  const handleCloseImageDialog = () => {
    setSelectedImage(null);
  };

  const handleSelectPrescription = (prescription) => {
    console.log(prescription);
    setSelectedPrescription(prescription);
    setConfirmDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedPrescription) {
      try {
        // Realiza la acción de retiro con el prescription_id y withdrawal_number
        await markWithdrawal(
          selectedPrescription.prescription_id,
          selectedPrescription.withdrawal_number,
          true
        );
        await registerWithdrawal(
          selectedPrescription.patient_id,
          selectedPrescription.prescription_id,
          selectedPrescription.medication,
          selectedPrescription.withdrawal_number
        );
        enqueueSnackbar("Retiro exitoso", {
          autoHideDuration: 900,
          variant: "success",
        });
        // Manejar la respuesta si es necesario
        console.log(selectedPrescription);
        setConfirmDialogOpen(false);
        onClose(); // Cierra el diálogo después de la confirmación
      } catch (error) {
        enqueueSnackbar("Error al registrar el retiro", {
          autoHideDuration: 900,
          variant: "error",
        });
        console.error("Error al confirmar el retiro:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"sm"}>
      <DialogTitle>Seleccionar receta para retiro</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {prescriptions.length ? (
              prescriptions.map((prescription) => (
                <ListItem key={prescription.prescription_id} divider>
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
                    secondary={`Vencimiento: ${format(
                      new Date(prescription.issue_date),
                      "dd/MM/yyyy"
                    )}`}
                  />
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Ver Receta">
                      <IconButton
                        color="success"
                        edge="end"
                        onClick={() =>
                          handleViewImage(prescription.prescription_image)
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      onClick={() => handleSelectPrescription(prescription)}
                    >
                      Retirar
                    </Button>
                  </Stack>
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
                  Sin Retiros Disponibles
                </Typography>
              </Box>
            )}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cerrar
        </Button>
      </DialogActions>
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        title="Confirmar retiro"
        description={`¿Desea efectuar el retiro de los medicamentos?`}
        onAction={handleConfirm}
        actionButton="Confirmar"
      />
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
};

export default WithdrawalListDialog;
