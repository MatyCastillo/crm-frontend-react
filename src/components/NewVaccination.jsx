import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Typography,
  InputLabel,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { addVaccination } from "../services";
import { useSnackbar } from "notistack";

const NewVaccination = ({ open, handleClose, patient }) => {
  const [medicamento, setMedicamento] = useState("");
  const [observacion, setObservacion] = useState(
    "El paciente presenta un estado de salud estable, sin síntomas agudos."
  );
  const [retirosRestantes, setRetirosRestantes] = useState(2); // Por ejemplo, 3 retiros restantes
  const [fotoReceta, setFotoReceta] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del nuevo retiro
    try {
      console.log("Nueva vacunación:", medicamento, "Id: ", patient.id);
      await addVaccination(patient.id, medicamento);
      enqueueSnackbar("Vacunación agregada exitosamente", {
        autoHideDuration: 900,
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Error al registrar la vacunación", {
        autoHideDuration: 900,
        variant: "error",
      });
      console.error("Error al crear la vacunación:", error);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Nueva Vacunación
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {" "}
          Nombre: {patient.first_name} {patient.last_name}{" "}
        </Typography>
        <Typography variant="body1"> DNI: {patient.dni} </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <InputLabel>Información de la Vacunación</InputLabel>

          <TextField
            label="Medicamento Aplicado"
            value={medicamento}
            onChange={(e) => setMedicamento(e.target.value)}
            fullWidth
          />

          <TextField
            label="Observación"
            value={patient.observations}
            disabled
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Confirmar Vacunación
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewVaccination;
