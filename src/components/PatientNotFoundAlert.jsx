import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import AddPatient from "./AddPatient"; // Ajusta la ruta si es necesario

const PatientNotFoundAlert = ({ open, onClose, dni, onPatientAdded }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleAddPatient = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    onClose(); // Cierra el diálogo de alerta
  };

  const handlePatientAdded = (dni) => {
    setModalOpen(false);
    onPatientAdded(dni); // Notifica a MainPage que un paciente ha sido añadido
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddPatient();
    }
  };

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [open]);

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Paciente no encontrado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            El DNI <strong>{dni}</strong> no se encuentra registrado. ¿Desea
            agregar un nuevo paciente?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            No
          </Button>
          <Button onClick={handleAddPatient} color="primary" autoFocus>
            Sí
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para agregar nuevo paciente */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md">
        <AddPatient dniProp={dni} onPatientAdded={handlePatientAdded}  isFromParent={true} />
      </Dialog>
    </>
  );
};

export default PatientNotFoundAlert;
