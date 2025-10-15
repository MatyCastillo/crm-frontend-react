import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  CardHeader,
} from "@mui/material";
import { SnackbarProvider, useSnackbar } from "notistack";
import moment from "moment-timezone";
import Header from "./HeaderDate";
import SearchBar from "./SearchBar";
import PatientNotFoundAlert from "./PatientNotFoundAlert";
import NewPresciption from "./NewPrescription";
import NewVaccination from "./NewVaccination";
import { getPatientByDni, getWithdrawalsById } from "../services";
import { capitalizeFirstLetter } from "../utils/helper";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import ArrowOutwardIcon from "@mui/icons-material/CallMade";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WithdrawalListDialog from "./WithdrawalDialog";

const MainPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [dateZ] = useState(new Date());
  const [openAlert, setOpenAlert] = useState(false);
  const [openNuevoRetiro, setOpenNuevoRetiro] = useState(false); // Estado para controlar el modal
  const [openNuevaVacunacion, setOpenNuevaVacunacion] = useState(false);
  const [patientWithdrawal, setPatientWithdrawal] = useState();
  const [patientData, setPatientData] = useState({
    name: "",
    last_name: "",
    dni: "",
    admissionDate: "",
    pendingWithdrawals: 0,
    observations: [],
    healthInsurance: "",
    branch: "",
    withdrawals: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [openWithdrawalListDialog, setOpenWithdrawalListDialog] =
    useState(false);
  const [dniShearch, setDniShearch] = useState("");

  const date = moment(dateZ)
    .tz("America/Argentina/Buenos_Aires")
    .format("YYYY-MM-DD");

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleSearch = async (dni) => {
    try {
      const patientData = await getPatientByDni(dni);
      console.log("paciente", patientData);
      if (patientData) {
        setDniShearch(dni);
        setPatientData(patientData.patient);
        const patientWithdrawalFetch = await getWithdrawalsById(
          patientData.patient.id
        );
        setPatientWithdrawal(patientWithdrawalFetch);
      } else {
        setSearchQuery(dni);
        setOpenAlert(true);
      }
    } catch {
      console.log("sin paciente");
    }
  };

  const handlePatientAdded = (dni) => {
    setSearchQuery(dni);
    setOpenAlert(false);
    handleSearch(dni); // Busca y actualiza los datos del nuevo paciente
  };

  const handleClickOpenNuevoRetiro = () => {
    setOpenNuevoRetiro(true);
  };

  const handleCloseNuevoRetiro = () => {
    setOpenNuevoRetiro(false);
  };

  const handleClickOpenNuevaVacunacion = () => {
    setOpenNuevaVacunacion(true);
  };

  const handleCloseNuevaVacunacion = () => {
    handleSearch(dniShearch);
    setOpenNuevaVacunacion(false);
  };

  const openWithdrawalList = () => {
    setOpenWithdrawalListDialog(true);
  };

  const handleCloseWithdrawalList = () => {
    setOpenWithdrawalListDialog(false);
  };

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={1000}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          // bgcolor: "primary.main",
          height: "85vh",
          overflow: "hidden",
          flexGrow: 1,
        }}
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: 2,
            pt: 0,
            boxSizing: "border-box",
          }}
        >
          <Grid
            container
            spacing={3}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ pt: 3, pr: 3 }}
          >
            <Grid item xs={6}>
              <Header />
            </Grid>
            <Grid item xs={5} key="search-bar">
              <SearchBar onSearch={handleSearch} />
            </Grid>
          </Grid>

          <Card
            variant="outlined"
            sx={{ width: "100%", marginTop: 2, position: "relative" }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h5">{`${
                  capitalizeFirstLetter(patientData.first_name) || "Buscar "
                } ${
                  capitalizeFirstLetter(patientData.last_name) || "Paciente"
                }`}</Typography>
                <Typography color="textSecondary">
                  DNI: {patientData.dni || "-"}
                </Typography>
                <Typography color="textSecondary">
                  Fecha de Alta:{" "}
                  {patientData.created_at
                    ? moment(patientData.created_at).format("DD/MM/YYYY")
                    : "-"}
                </Typography>
                <Typography color="textSecondary">
                  Obra Social: {patientData.health_insurance || "-"}
                </Typography>
                <Typography color="textSecondary">
                  N° de Afiliado: {patientData.affiliate_number || "-"}
                </Typography>
                <Typography color="textSecondary">
                  Sucursal de Alta: {patientData.branch || "-"}
                </Typography>
              </Box>
              {/* <Typography
                variant="h4"
                color="error"
                sx={{ textAlign: "right" }}
              >
                {patientData.pendingWithdrawals} Retiros Pendientes
              </Typography> */}
            </CardContent>
          </Card>

          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ height: "200px" }}>
                <CardHeader avatar={<VisibilityIcon />} title="Observaciones" />

                <CardContent sx={{ mt: -3 }}>
                  {patientData.observations ? (
                    <Typography variant="body1">
                      {patientData.observations}
                    </Typography>
                  ) : (
                    <Typography variant="body1">Sin observaciones</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ height: "200px" }}>
                <CardHeader avatar={<ArrowOutwardIcon />} title="Retiros" />

                <CardContent sx={{ mt: -3 }}>
                  {/* Renderiza aquí los detalles de los retiros */}
                  {patientWithdrawal && patientWithdrawal.length > 0 ? (
                    <>
                      {patientWithdrawal.map((vaccination, index) => (
                        <Typography key={index} variant="body1">
                          {JSON.parse(vaccination.medication)}
                          {" - "}
                          {new Date(
                            vaccination.withdrawal_date
                          ).toLocaleDateString()}
                        </Typography>
                      ))}
                    </>
                  ) : (
                    <Typography variant="body1">
                      No hay retiros registrados.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ height: "200px" }}>
                <CardHeader avatar={<VaccinesIcon />} title="Vacunaciones" />
                <CardContent sx={{ mt: -3 }}>
                  {/* Renderiza aquí los detalles de las vacunaciones */}
                  {patientData.vaccinations &&
                  patientData.vaccinations.length > 0 ? (
                    <>
                      {patientData.vaccinations.map((vaccination, index) => (
                        <Typography key={index} variant="body1">
                          {vaccination.medication_applied}
                          {" - "}
                          {new Date(
                            vaccination.date_of_vaccination
                          ).toLocaleDateString()}
                        </Typography>
                      ))}
                    </>
                  ) : (
                    <Typography variant="body1">
                      No hay vacunaciones registradas.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
            <Grid item>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  disabled={!patientData.dni}
                  onClick={handleClickOpenNuevaVacunacion}
                >
                  Nueva Vacunación
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!patientData.dni}
                  onClick={openWithdrawalList}
                >
                  Nuevo Retiro
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  disabled={!patientData.dni}
                  onClick={handleClickOpenNuevoRetiro}
                >
                  Nueva Receta
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      <PatientNotFoundAlert
        open={openAlert}
        onClose={handleCloseAlert}
        dni={searchQuery}
        onPatientAdded={handlePatientAdded}
      />
      <NewPresciption
        patient={patientData}
        open={openNuevoRetiro}
        handleClose={handleCloseNuevoRetiro}
      />

      <NewVaccination
        patient={patientData}
        open={openNuevaVacunacion}
        handleClose={handleCloseNuevaVacunacion}
      />
      <WithdrawalListDialog
        open={openWithdrawalListDialog}
        onClose={handleCloseWithdrawalList}
        patientId={patientData.id}
      />
    </SnackbarProvider>
  );
};

export default MainPage;
