import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatCurrency } from "../utils/numberFormat";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&.sticky": {
    position: "sticky",
    bottom: 0,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function PaymentTable({ payments, onDelete }) {
  const tableContainerRef = useRef(null);

  const [paymentList, setPaymentList] = useState([]);

  useEffect(() => {
    setPaymentList(payments);
  }, [payments]);

  const calculateGeneralTotal = () => {
    return paymentList
      .reduce((total, payment) => {
        return payment.method !== "diferencia"
          ? total + parseFloat(payment.amount)
          : total;
      }, 0)
      .toFixed(2);
  };

  const scrollToBottom = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop =
        tableContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [paymentList]);

  return (
    <Paper
      style={{
        height: "90%",
        display: "flex",
        flexDirection: "column",
        margin: 16,
        width: "320px",
        vw: "auto",
        maxHeight: "400px",
      }}
    >
      <Typography
        variant="body1"
        gutterBottom
        style={{ marginBottom: 0, paddingLeft: 16 }}
      >
        Historial de Pagos
      </Typography>
      <TableContainer
        style={{ flex: 1, maxHeight: "500px", overflowY: "auto" }}
        ref={tableContainerRef}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", width: "40%" }}>
                Tipo de Pago
              </TableCell>
              <TableCell style={{ fontWeight: "bold", width: "40%" }}>
                Monto
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", width: "20%" }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentList.length > 0 ? (
              paymentList.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{payment.method.toUpperCase()}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="delete"
                      onClick={() => onDelete(payment)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay pagos disponibles
                </TableCell>
              </TableRow>
            )}
            <StyledTableRow className="sticky">
              <TableCell style={{ fontWeight: "bold" }}>
                Total General
              </TableCell>
              <TableCell align="right" style={{ fontWeight: "bold" }}>
                {formatCurrency(calculateGeneralTotal())}
              </TableCell>
              <TableCell></TableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
