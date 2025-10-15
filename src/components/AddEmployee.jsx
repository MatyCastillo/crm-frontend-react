import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { addEmployee, updateEmployee, checkUsernameUnique } from "../services";

const AddEmployee = ({ employeeData, onSubmitSuccess }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (employeeData) {
      setUsername(employeeData.username);
      setName(employeeData.name);
      setSurname(employeeData.surname);
      setBranch(employeeData.branch);
      // setPassword(employeeData.password);
      setRole(employeeData.role);
    }
  }, [employeeData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeData) {
      // Si es un nuevo empleado
      try {
        const isUnique = await checkUsernameUnique(username);
        if (!isUnique) {
          setUsernameError("El nombre de usuario ya está en uso.");
          return;
        }
      } catch (error) {
        enqueueSnackbar("Error al verificar el nombre de usuario", {
          autoHideDuration: 800,
          variant: "error",
        });
        return;
      }
    }

    const empleado = {
      username,
      name,
      surname,
      branch,
      password,
      role,
    };

    try {
      if (employeeData) {
        await updateEmployee(employeeData.id, empleado); // Actualiza el empleado existente
        enqueueSnackbar("Empleado actualizado correctamente", {
          autoHideDuration: 800,
          variant: "success",
        });
      } else {
        await addEmployee(empleado); // Añade un nuevo empleado
        enqueueSnackbar("Empleado añadido correctamente", {
          autoHideDuration: 800,
          variant: "success",
        });
        window.location.reload();
      }
      onSubmitSuccess(); // Cierra el modal y actualiza la lista
    } catch (error) {
      console.log("entra al catch", error);
      enqueueSnackbar("Error al guardar el empleado", {
        autoHideDuration: 800,
        variant: "error",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <Typography variant="h5">
        {employeeData ? "Editar Personal" : "Añadir Personal"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre de Usuario"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value.toLowerCase());
            setUsernameError("");
          }}
          required
          fullWidth
          margin="normal"
          error={!!usernameError}
          helperText={usernameError}
        />
        <TextField
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Apellido"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Sucursal</InputLabel>
          <Select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            required
          >
            <MenuItem value="01">Farmacia Farmanele</MenuItem>
            <MenuItem value="02">Farmacia Anele</MenuItem>
            <MenuItem value="03">Farmacia MGM</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Contraseña"
          type="text" // Mostrar la contraseña como texto
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Rol</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="seller">Personal</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {employeeData ? "Actualizar Personal" : "Añadir Personal"}
        </Button>
      </form>
    </Box>
  );
};

export default AddEmployee;
