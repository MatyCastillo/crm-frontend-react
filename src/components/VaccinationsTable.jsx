import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { getVaccinations } from "../services";
import { capitalizeFirstLetter } from "../utils/helper";

const VaccinationTable = () => {
  const [vaccinations, setVaccinations] = useState([]);

  useEffect(() => {
    // Función para obtener las vacunaciones desde el backend
    const fetchVaccinations = async () => {
      try {
        const data = await getVaccinations(); // Llamar al método desde el index.js
        setVaccinations(data); // Guardar los datos en el estado
      } catch (error) {
        console.error("Error al obtener vacunaciones:", error);
      }
    };

    fetchVaccinations();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Vacunaciones
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vaccinations.length > 0 ? (
              vaccinations.map((vaccination) => (
                <TableRow key={vaccination.id}>
                  <TableCell>{vaccination.medication_applied}</TableCell>
                  <TableCell>{`${capitalizeFirstLetter(
                    vaccination.first_name
                  )} ${capitalizeFirstLetter(
                    vaccination.last_name
                  )}`}</TableCell>
                  <TableCell>{vaccination.dni}</TableCell>
                  <TableCell>
                    {new Date(
                      vaccination.date_of_vaccination
                    ).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
                  No se encontraron vacunaciones
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VaccinationTable;
