import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Dialog,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddEmployee from "./AddEmployee";
import { getEmployees } from "../services";
import { capitalizeFirstLetter } from "../utils/helper";
import getBranchById from "../utils/getBranchById";

export default function EmployeesTable() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [employeesList, setEmployeesList] = useState([]);

  // Función para obtener la lista de empleados
  const fetchEmployees = async () => {
    try {
      const employees = await getEmployees();
      setEmployeesList(employees);
    } catch (error) {
      console.error("Error al obtener la lista de empleados:", error);
    }
  };

  useEffect(() => {
    // Llamar a la función para cargar la lista de empleados cuando el componente se monta
    fetchEmployees();
  }, []);

  const handleClose = () => {
    setSelectedEmployee(null);
    setOpenModal(false);
  };

  const handleUpdateSuccess = () => {
    fetchEmployees(); // Volver a cargar la lista de empleados después de modificar un empleado
    setOpenModal(false);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    console.log(`Eliminar empleado con id ${id}`);
    // Lógica para eliminar el empleado
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Empleados
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre de Usuario</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Sucursal</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeesList.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.username}</TableCell>
                <TableCell>{capitalizeFirstLetter(employee.name)}</TableCell>
                <TableCell>{capitalizeFirstLetter(employee.surname)}</TableCell>
                <TableCell>
                  {employee.role === "admin" ? "Administrador" : "Personal"}
                </TableCell>
                <TableCell>
                  Farmacia {getBranchById(employee.branch).name}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(employee)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {/* <Tooltip title="Borrar">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(employee.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openModal} onClose={handleClose}>
        <AddEmployee
          employeeData={selectedEmployee}
          onSubmitSuccess={handleUpdateSuccess}
        />
      </Dialog>
    </Box>
  );
}
