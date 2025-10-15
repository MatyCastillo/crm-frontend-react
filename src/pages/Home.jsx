import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import Inicio from "../components/MainPage";
import AddEmployee from "../components/AddEmployee";
import AddPatient from "../components/AddPatient";
import PatientsTable from "../components/PatientsTable";
import { SnackbarProvider } from "notistack";
import sidebarConfig from "../config/sidebarConfig.json";
import { Box } from "@mui/material";
import ToExpireTable from "../components/ToExpireTable";
import EmployeesTable from "../components/EmployeesTable";
import VaccinationTable from "../components/VaccinationsTable";

export default function Home({ route }) {
  const navigate = useNavigate();
  const { isLogged } = useUser();

  useEffect(() => {
    if (!isLogged) {
      navigate("/login", {
        state: { message: "Inicie sesión para continuar" },
      });
    }
  }, [isLogged, navigate]);

  const renderComponent = (route) => {
    switch (route) {
      case "add-employee":
        return <AddEmployee />;
      case "add-patient":
        return <AddPatient />;
      case "patients-table":
        return <PatientsTable />;
      case "to-expire-table":
        return <ToExpireTable />;
        case "employees-table":
          return <EmployeesTable />;
          case "vaccinations-table":
            return <VaccinationTable />;
      default:
        return <Inicio />;
    }
  };

  const handleClickOpenModal = () => {
    // Lógica para abrir un modal
  };

  const handleClickOpenModalProv = () => {
    // Lógica para abrir un modal del proveedor
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <Box sx={{ display: "flex" }}>
        <NavBar />
        <Sidebar
          openSideBar={true}
          isMobile={window.innerWidth <= 500}
          userType={sessionStorage.getItem("userType")}
          location={useNavigate()}
          handleClickOpenModal={handleClickOpenModal}
          handleClickOpenModalProv={handleClickOpenModalProv}
          sidebarItems={sidebarConfig}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 6 }}>
          {renderComponent(route)}
        </Box>
      </Box>
    </SnackbarProvider>
  );
}
