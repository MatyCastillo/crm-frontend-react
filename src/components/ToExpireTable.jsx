import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  getUpcommingExpirationPrescriptions,
  // markAsNotificationSend,
  updateNotificationStatus,
} from "../services";
import { capitalizeFirstLetter } from "../utils/helper";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { addDays, parseISO, format, isValid } from "date-fns";
import ConfirmDialog from "./ConfirmDialog";
import getBranchById from "../utils/getBranchById";

const ToExpireTable = () => {
  const branch = sessionStorage.getItem("branch");
  const [prescriptions, setPrescriptions] = useState([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null); // { patient, withdrawalNumber, notified }
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedWithdrawalNumber, setSelectedWithdrawalNumber] =
    useState(null);

  const fetchPrescriptions = async () => {
    try {
      const prescriptions = await getUpcommingExpirationPrescriptions();
      setPrescriptions(prescriptions);
    } catch (err) {
      console.log("Error al obtener las recetas", err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const calculateExpiration = (initialDate, days) => {
    const date = new Date(parseISO(initialDate));
    addDays(date, days);
  };

  const viewDate = (withdrawal_info, withdrawalNumber) => {
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(withdrawal_info);
      } catch (error) {
        console.error("Error parsing withdrawal_info:", error);
        return "Error processing withdrawal data";
      }

      if (!parsedData.withdrawals || !Array.isArray(parsedData.withdrawals)) {
        console.error(
          "Invalid withdrawal data: Expected an array of withdrawals."
        );
        return "Error processing withdrawal data";
      }

      const withdrawal = parsedData.withdrawals.find(
        (w) => w.withdrawal_number === withdrawalNumber
      );

      if (!withdrawal) {
        console.error("Withdrawal not found");
        return "Withdrawal not found";
      }

      const date = new Date(withdrawal.notification_date);

      if (isNaN(date.getTime())) {
        console.error("Invalid notification date format.");
        return "Error processing withdrawal date";
      }

      return format(date, "dd/MM/yyyy");
    } catch (error) {
      console.error("Error processing withdrawal date:", error);
      return "Error processing withdrawal date";
    }
  };

  const handleOpenConfirmation = (patient, withdrawalNumber, notified) => {
    setSelectedPatient(patient);
    setSelectedWithdrawalNumber(withdrawalNumber);
    setConfirmationAction({ patient, withdrawalNumber, notified });
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleConfirm = async () => {
    if (!confirmationAction) return;

    const { patient, withdrawalNumber, notified } = confirmationAction;

    try {
      // Clonar el objeto withdrawal_info para modificarlo
      let updatedWithdrawals = [
        ...JSON.parse(patient.withdrawal_info).withdrawals,
      ];

      // Encontrar el retiro correcto y actualizar el estado de notificación
      updatedWithdrawals = updatedWithdrawals.map((withdrawal) => {
        if (withdrawal.withdrawal_number === withdrawalNumber) {
          return { ...withdrawal, notified: !notified }; // Cambiar el estado de notificación
        }
        return withdrawal;
      });

      const updatedWithdrawalInfo = JSON.stringify({
        withdrawals: updatedWithdrawals,
      });

      // Llamar al método del servicio para actualizar en el servidor
      await updateNotificationStatus(
        patient.prescription_id,
        withdrawalNumber,
        !notified
      );

      // Actualizar la lista de recetas (prescriptions) en el estado
      setPrescriptions((prevPrescriptions) =>
        prevPrescriptions.map((presc) =>
          presc.dni === patient.dni
            ? { ...patient, withdrawal_info: updatedWithdrawalInfo }
            : presc
        )
      );
      fetchPrescriptions();
      setOpenConfirmation(false);
    } catch (error) {
      console.error("Error al actualizar el estado de la notificación", error);
    }
  };

  // Función para calcular retiros restantes
  const calculateRemainingWithdrawals = (withdrawalInfo) => {
    console.log(withdrawalInfo);
    if (!withdrawalInfo || !withdrawalInfo.withdrawals) {
      return 0; // Si no hay retiros, devolver 0
    }

    // Obtener la fecha actual
    const currentDate = new Date();

    // Filtrar aquellos retiros que no han sido completados y cuya fecha de retiro es null o mayor a la fecha actual
    const remainingWithdrawals = withdrawalInfo.withdrawals.filter(
      (withdrawal) =>
        (!withdrawal.withdrawn && // No ha sido marcado como completado
          !withdrawal.notification_date) ||
        new Date(withdrawal.notification_date) > currentDate // withdrawal_date es null o mayor a la fecha actual
    );

    // Devolver el número de retiros restantes
    return remainingWithdrawals.length;
  };

  function sumarDias(fechaISO, dias) {
    // Convertir la fecha ISO en un objeto Date
    let fecha = new Date(fechaISO);

    // Sumar los días
    fecha.setDate(fecha.getDate() + dias);

    // Formatear la fecha en "dd/MM/yyyy" y retornarla
    return format(fecha, "dd/MM/yyyy");
  }

  const makeMessage = (patient) => {
    const message = `Estimado/a ${capitalizeFirstLetter(
      patient.first_name
    )} ${capitalizeFirstLetter(
      patient.last_name
    )},\n\n te recordamos que el día ${sumarDias(
      patient.issue_date,
      30
    )} vence tu receta de los siguiente medicamentos: ${JSON.parse(
      patient.medication
    )}.\n\n Para no perder los medicamentos acercate a Farmacia ${
      getBranchById(branch).name
    }, ubicada en ${getBranchById(branch).direction}.\n\n Saludos cordiales.\n`;
    const whatsAppUrl = `https://api.whatsapp.com/send/?phone=549${patient.phone_number}&text=${message}`;
    return whatsAppUrl;
  };

  const checkNotificationsStatus = (withdrawal_info, withdrawalNumber) => {
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(withdrawal_info);
      } catch (error) {
        console.error("Error parsing withdrawal_info:", error);
        return "Error processing withdrawal data";
      }

      if (!parsedData.withdrawals || !Array.isArray(parsedData.withdrawals)) {
        console.error(
          "Invalid withdrawal data: Expected an array of withdrawals."
        );
        return "Error processing withdrawal data";
      }

      const withdrawal = parsedData.withdrawals.find(
        (w) => w.withdrawal_number === withdrawalNumber
      );

      if (!withdrawal) {
        console.error("Withdrawal not found");
        return "Withdrawal not found";
      }

      return withdrawal.notified;
    } catch (error) {
      console.error("Error processing withdrawal date:", error);
      return "Error " + error.message;
    }
  };

  const parseIssueDate = (issueDate) => {
    const parsedDate = new Date(issueDate);
    return format(parsedDate, "dd/MM/yyyy");
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Retiros a Vencer
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del Paciente</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Expedisión</TableCell>
              <TableCell>Enviar WhatsApp</TableCell>
              <TableCell>Enviado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(prescriptions) && prescriptions.length > 0 ? (
              prescriptions.map((patient, index) => {
                const withdrawalInfo = JSON.parse(patient.withdrawal_info);
                return (
                  <TableRow key={index}>
                    <TableCell>
                      {capitalizeFirstLetter(patient.first_name)}{" "}
                      {capitalizeFirstLetter(patient.last_name)}
                    </TableCell>
                    <TableCell>{patient.dni}</TableCell>
                    <TableCell>{parseIssueDate(patient.issue_date)}</TableCell>
                    <TableCell>
                      <Tooltip title="Enviar WhatsApp">
                        <IconButton
                          onClick={() =>
                            window.open(makeMessage(patient), "_blank")
                          }
                        >
                          <WhatsAppIcon sx={{ color: "green" }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={checkNotificationsStatus(
                          patient.withdrawal_info,
                          patient.withdrawal_number
                        )}
                        onChange={() =>
                          handleOpenConfirmation(
                            patient,
                            patient.withdrawal_number,
                            checkNotificationsStatus(
                              patient.withdrawal_info,
                              patient.withdrawal_number
                            )
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay recetas para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={openConfirmation}
        onAction={handleConfirm}
        actionButtonColor="success"
        onClose={handleCloseConfirmation}
        handleClose={handleCloseConfirmation}
        title="Confirmar cambio de notificación"
        description="¿Desea cambiar el estado de la notificación?"
      />
    </Box>
  );
};

export default ToExpireTable;
