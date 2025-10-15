import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import Prescription from "@mui/icons-material/ContentPaste";
import { getPatients } from "../services";
import DialogModal from "./DialogModal";
import AddPatient from "../components/AddPatient";
import { capitalizeFirstLetter } from "../utils/helper";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import PrescriptionListDialog from "./PrescriptionListDialog";
import WithdrawalListDialog from "./WithdrawalsDonesList";

export default function PatientsTable() {
  const [patientsList, setPatientsList] = useState([]);
  const [openModal, setopenModal] = useState(false);
  const [observation, setObservation] = useState("Sin observaciones");
  const [patientToEdit, setpatientToEdit] = useState([]);
  const [editPatientModal, seteditPatientModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteModal, setDeleteModal] = useState([]);
  const [idDelete, setIdDelete] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [patientID, setPatientID] = useState(null);
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false); // Nueva variable para manejar el modal de recetas
  const [openWithdrawalModal, setOpenWithdrawalModal] = useState(false);
  // Función para abrir el diálogo de confirmación de eliminación
  const handleOpenDeleteDialog = (patient) => {
    setPatientToDelete(patient);
    setOpenDeleteDialog(true);
  };

  // Función para cerrar el diálogo de confirmación de eliminación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPatientToDelete(null);
  };

  // Función para manejar el éxito de la eliminación
  const handleDeleteSuccess = () => {
    fetchPatients(); // Actualizar la lista de pacientes después de eliminar
    handleCloseDeleteDialog();
  };

  const handleEditPatient = (patient) => {
    setpatientToEdit(patient);
    seteditPatientModal(true);
  };

  const handleCloseEditPatient = () => {
    seteditPatientModal(false);
  };

  const handleClickOpenModal = (patientObservation) => {
    setObservation(patientObservation);
    setopenModal(true);
  };

  const handleCloseDialogModal = () => {
    setopenModal(false);
  };

  const handleClickOpenPrescriptionModal = (patientId) => {
    setPatientID(patientId);
    setOpenPrescriptionModal(true); // Usar el nuevo estado para abrir el modal de recetas
  };

  const handleClosePrescriptionModal = () => {
    setPatientID(null);
    setOpenPrescriptionModal(false); // Cerrar el modal de recetas correctamente
  };

  const handleOpenWithdrawalModal = (patientId) => {
    setPatientID(patientId);
    setOpenWithdrawalModal(true);
  };

  const handleCloseWithdrawalModal = () => {
    setPatientID(null);
    setOpenWithdrawalModal(false); // Cerrar el modal de recetas correctamente
  };

  // Función para obtener la lista de pacientes
  const fetchPatients = async () => {
    try {
      const patients = await getPatients();
      setPatientsList(patients);
    } catch (error) {
      console.error("Error al obtener la lista de pacientes:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleUpdateSuccess = () => {
    fetchPatients(); // Volver a cargar la lista de pacientes después de modificar
    seteditPatientModal(false);
  };

  return (
    <Box sx={{ padding: 2, height: "300px" }}>
      <Typography variant="h4" gutterBottom>
        Pacientes
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre y Apellido</TableCell>
              <TableCell>N° Afiliado</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Obra Social</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientsList.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  {capitalizeFirstLetter(patient.first_name)}{" "}
                  {capitalizeFirstLetter(patient.last_name)}
                </TableCell>
                <TableCell>{patient.affiliate_number}</TableCell>
                <TableCell>{patient.dni}</TableCell>
                <TableCell>{patient.phone_number}</TableCell>
                <TableCell>{patient.health_insurance}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditPatient(patient)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver Observaciones">
                    <IconButton
                      color="warning"
                      onClick={() => handleClickOpenModal(patient.observations)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver Recetas">
                    <IconButton
                      color="success"
                      onClick={() =>
                        handleClickOpenPrescriptionModal(patient.id)
                      }
                    >
                      <Prescription />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Retiros">
                    <IconButton
                      color="success"
                      onClick={() => handleOpenWithdrawalModal(patient.id)}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Borrar">
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(patient)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DialogModal
        content={observation}
        title="Observaciones"
        open={openModal}
        handleClose={handleCloseDialogModal}
      ></DialogModal>
      <Dialog
        open={editPatientModal}
        onClose={handleCloseEditPatient}
        maxWidth="md"
      >
        <AddPatient
          patient={patientToEdit}
          onSubmitSuccess={handleUpdateSuccess}
        />
      </Dialog>
      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        patientDni={patientToDelete?.dni}
        patientId={patientToDelete?.id}
        onDeleteSuccess={handleDeleteSuccess}
      />
      <PrescriptionListDialog
        open={openPrescriptionModal} // Usar el nuevo estado aquí
        handleClose={handleClosePrescriptionModal}
        patientId={patientID}
      />

      <WithdrawalListDialog
        open={openWithdrawalModal}
        handleClose={handleCloseWithdrawalModal}
        patientId={patientID}
      />
    </Box>
  );
}
