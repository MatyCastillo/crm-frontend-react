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
  IconButton,
  Autocomplete,
  InputLabel,
  Stack,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { isAfter, format } from "date-fns";
import { Add, Close as CloseIcon } from "@mui/icons-material";
import { addPrescription } from "../services";
import { useSnackbar } from "notistack";

const NewPrescription = ({ open, handleClose, patient }) => {
  const [medicationsList, setMedicationsList] = useState([]);
  const [medicationsAddedList, setMedicationsAddedList] = useState([]);
  const [fotoReceta, setFotoReceta] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [issueDate, setIssueDate] = useState(null);
  const [validityPeriod, setValidityPeriod] = useState("");
  const [textHelperDate, setTextHelperDate] = useState("Fecha de emisión");
  const { enqueueSnackbar } = useSnackbar();
  const today = new Date();
  const [addedNonPrescriptionField, setAddedNonPrescriptionField] =
    useState(false);

  const medications = [
    "Paracetamol",
    "Ibuprofeno",
    "Amoxicilina",
    "Azitromicina",
    "Loratadina",
    "Omeprazol",
    "Metformina",
    "Enalapril",
    "Atorvastatina",
    "Acetaminofén",
    "Diclofenaco",
    "Cefalexina",
    "Losartán",
    "Furosemida",
    "Dexametasona",
    "Ranitidina",
    "Clonazepam",
    "Simvastatina",
    "Levotiroxina",
    "Albuterol",
  ];

  useEffect(() => {
    if (open) {
      setMedicationsList([undefined]);
      setMedicationsAddedList([]);
      setFotoReceta(null);
      setFotoPreview(null);
      setValidityPeriod("");
      setIssueDate(null);
      setTextHelperDate("Fecha de emisión");
      setAddedNonPrescriptionField(false);
    }
  }, [open]);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result);
      reader.readAsDataURL(file);
      setFotoReceta(file);
    } else {
      setFotoPreview(null);
    }
  };

  const handleAddMedication = () => {
    if (!addedNonPrescriptionField) {
      setMedicationsAddedList([...medicationsAddedList, ""]); // Añadir campo vacío en medicationsAddedList
      setAddedNonPrescriptionField(true);
    }
  };

  const handleMedicationChange = (index, newValue) => {
    const updatedList = medicationsList.map((medication, i) =>
      i === index ? newValue : medication
    );
    setMedicationsList(updatedList);
  };

  const handleAddedMedicationChange = (newValue) => {
    // Actualiza el valor de la medicación sin receta
    setMedicationsAddedList([newValue]);
  };

  const handleSubmit = async () => {
    const prescriptionData = {
      patientId: patient.id,
      medications: medicationsList,
      medicationsAddedList: medicationsAddedList,
      fotoReceta,
      validityPeriod,
      issueDate: format(issueDate, "yyyy-MM-dd"),
    };
    try {
      await addPrescription(prescriptionData);
      enqueueSnackbar("Receta agregada exitosamente", {
        autoHideDuration: 900,
        variant: "success",
      });
      handleClose();
    } catch (error) {
      enqueueSnackbar("Error al agregar la receta", {
        autoHideDuration: 900,
        variant: "error",
      });
      console.error("Error al agregar la prescripción:", error);
    }
  };

  const setIssue = (date) => {
    const result = isAfter(today, date);
    setTextHelperDate(
      result ? "" : "La fecha de emisión debe ser anterior a la actual"
    );
    result ? setIssueDate(date) : setIssueDate("");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Nueva Receta
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: "absolute", right: 8, top: 8, color: "grey[500]" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Nombre: {patient.first_name} {patient.last_name}
          </Typography>
          <Typography variant="body1">DNI: {patient.dni}</Typography>

          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <InputLabel>Foto de la receta</InputLabel>
            <Button variant="contained" component="label">
              Cargar foto receta
              <input type="file" hidden onChange={handleFotoChange} />
            </Button>

            {fotoPreview && (
              <Box
                mt={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <img
                  src={fotoPreview}
                  alt="Vista previa"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
                <Typography variant="body2" color="textSecondary">
                  {fotoReceta?.name}
                </Typography>
              </Box>
            )}
            {medicationsList.map((medication, index) => (
              <Stack direction="row" spacing={2}>
                <TextField
                  key={index}
                  label={`Medicación ${index + 1}`}
                  value={medication || ""}
                  onChange={(e) =>
                    handleMedicationChange(index, e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <Button variant="outlined" Endicon={<Add />}></Button>
              </Stack>
            ))}
            <Button
              variant="outlined"
              size="small"
              onClick={handleAddMedication}
              disabled={addedNonPrescriptionField}
            >
              Agregar Medicación sin Receta
            </Button>

            {addedNonPrescriptionField && (
              <TextField
                label="Medicación sin receta"
                value={medicationsAddedList[0] || ""}
                onChange={(e) => handleAddedMedicationChange(e.target.value)}
                fullWidth
                margin="normal"
              />
            )}

            <Typography variant="body1" mt={2}>
              Fecha de emisión de la receta:
            </Typography>
            <DatePicker
              label={textHelperDate}
              value={issueDate}
              onChange={(newValue) => setIssue(newValue)}
              inputFormat="dd/MM/yyyy"
              renderInput={(params) => <TextField {...params} />}
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
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Agregar Receta
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default NewPrescription;
