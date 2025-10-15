import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { addPatient, checkDniUnique, updatePatient } from "../services";

const AddPatient = ({
  dniProp,
  onPatientAdded,
  onClose,
  patient,
  onSubmitSuccess,
  isFromParent,
}) => {
  const [dni, setDni] = useState(dniProp || "");
  const [first_name, setFirstName] = useState("");
  const [affiliate_number, setAffiliate] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [observations, setObservations] = useState("");
  const [dniError, setDniError] = useState("");
  const [health_insurance, setHealthInsurance] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const userName = sessionStorage.getItem("user");
  const userBranch = sessionStorage.getItem("branch");

  const dniInputRef = useRef(null);
  const nombreInputRef = useRef(null);

  useEffect(() => {
    if (patient) {
      setDni(patient.dni);
      setFirstName(patient.first_name);
      setLastName(patient.last_name);
      setPhoneNumber(patient.phone_number);
      setObservations(patient.observations);
    }
    if (dniProp) {
      setDni(formatDni(dniProp));
      nombreInputRef.current.focus();
    } else {
      dniInputRef.current.focus();
    }
  }, [dniProp]);

  const formatDni = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    if (cleanedValue.length > 10) return cleanedValue.slice(0, 8);
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleDniChange = (e) => {
    let value = e.target.value;
    value = value.replace(/^0+/, "");
    setDni(formatDni(value));
    setDniError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient) {
      try {
        const isUnique = await checkDniUnique(dni.replace(/\./g, ""));
        if (!isUnique) {
          setDniError("El DNI ya está en uso.");
          return;
        }
      } catch (error) {
        enqueueSnackbar("Error al verificar el DNI", {
          autoHideDuration: 800,
          variant: "error",
        });
        return;
      }
    }
    const paciente = {
      dni: dni.replace(/\./g, ""),
      first_name,
      last_name,
      phone_number: phone_number.replace(/^0+/, ""),
      health_insurance,
      affiliate_number,
      branch: userBranch,
      observations,
      created_by: userName,
    };

    try {
      if (patient) {
        await updatePatient(patient.id, paciente);
        enqueueSnackbar("Paciente editado correctamente", {
          autoHideDuration: 800,
          variant: "success",
        });
        onSubmitSuccess();
      } else {
        await addPatient(paciente);
        enqueueSnackbar("Paciente añadido correctamente", {
          autoHideDuration: 800,
          variant: "success",
        });
        if (!isFromParent) {
          window.location.reload();
        }
      }

      setDni("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setObservations("");
      setDniError("");
      dniInputRef.current.focus();

      if (onPatientAdded) {
        onPatientAdded(paciente.dni); // Llama a la función con el DNI del paciente
      }

      if (onClose) {
        onClose(); // Cierra el modal
      }
    } catch (error) {
      console.log("error", error);
      enqueueSnackbar("Error al añadir paciente", {
        autoHideDuration: 800,
        variant: "error",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <Typography variant="h5">Añadir Paciente</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Obra Social</InputLabel>
          <Select
            value={health_insurance}
            onChange={(e) => setHealthInsurance(e.target.value)}
            required
          >
            <MenuItem value="PAMI">PAMI</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="N° Afiliado"
          value={affiliate_number}
          onChange={(e) => setAffiliate(e.target.value)}
          required
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="DNI"
          value={dni}
          onChange={handleDniChange}
          required
          fullWidth
          margin="normal"
          error={!!dniError}
          helperText={dniError}
          inputRef={dniInputRef}
        />
        <TextField
          label="Nombre"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          required
          fullWidth
          margin="normal"
          inputRef={nombreInputRef}
        />
        <TextField
          label="Apellido"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Telefono"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          fullWidth
          margin="normal"
          helperText="Ingrese el número con código de área sin 0 ni 15. Por ejemplo: 1122334455"
        />
        <TextField
          label="Observaciones"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ color: "white" }}
        >
          {patient ? "Editar Paciente" : "Añadir Paciente"}
        </Button>
      </form>
    </Box>
  );
};

export default AddPatient;
