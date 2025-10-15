import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deletePatient } from "../services"; // Importa el método Axios para eliminar el paciente

const ConfirmDeleteDialog = ({ open, onClose, patientDni, patientId, onDeleteSuccess }) => {

  const handleDelete = async () => {
    try {
      await deletePatient(patientId);
      onDeleteSuccess(); // Llama a la función para actualizar la lista de pacientes después de eliminar
      onClose(); // Cierra el diálogo
    } catch (error) {
      console.error("Error al eliminar el paciente:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Eliminar Paciente</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {patientDni
            ? `¿Estás seguro de que deseas eliminar al paciente con DNI ${patientDni}?`
            : "¿Estás seguro de que deseas eliminar este paciente?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleDelete} color="secondary">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
