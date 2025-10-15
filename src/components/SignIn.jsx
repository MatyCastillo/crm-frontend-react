import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TransitionAlerts from "./snackbar";

import theme from "../theme/theme";
import loginImg from "../assets/img/logo.png";
import useUser from "../hooks/useUser";

export default function SignIn() {
  const { isLoginLoading, hasLoginError, login, isLogged, statusMessage } =
    useUser();
  const [nombre, setNombre] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Redirecciona si ya está logueado
  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, [isLogged, navigate]);

  // Manejo de errores de login
  useEffect(() => {
    if (hasLoginError) {
      setErrorMessage(
        statusMessage ||
          "Error en el inicio de sesión. Verifique sus credenciales."
      );
      setAlertOpen(true);
    }
  }, [hasLoginError, statusMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nombre || !password) {
      setErrorMessage("Por favor, complete todos los campos.");
      setAlertOpen(true);
      return;
    }
    const success = await login({ nombre, password });
    if (success) {
      navigate("/");
    } else {
      setErrorMessage(
        "Error en el inicio de sesión. Verifique sus credenciales."
      );
      setAlertOpen(true);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              width: 100,
              height: 100,
            }}
            src={loginImg}
          />
          <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
            ¡Bienvenido!
          </Typography>
          {/* Componente para mostrar alertas */}
          <TransitionAlerts
            open={alertOpen}
            setOpen={setAlertOpen}
            title={errorMessage}
            type={"error"}
          />
          {isLoginLoading ? (
            <>
              <Typography variant="body2">
                Comprobando credenciales...
              </Typography>
              <CircularProgress />
            </>
          ) : (
            ""
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              size="small"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuario"
              name="username"
              autoFocus
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <FormControl
              sx={{ mt: 2, width: "100%" }}
              variant="outlined"
              size="small"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Contraseña
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
              />
            </FormControl>
            <Typography>
              usuario: admin
              <br /> contraseña: admin
            </Typography>
            <Button
              size="large"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="#" variant="body2">
                  Olvidé mi contraseña
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
