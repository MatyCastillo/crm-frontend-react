import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  ThemeProvider,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useUser from "../hooks/useUser";
import AvatarNab from "./avatarNab";
import noAvatar from "../img/no-avatar.png";
import NotificationsMenu from "./notifications";
import themeCustom from "../theme/theme";

const isMobile = window.innerWidth <= 500;

export default function NavBar(props) {
  const { logout } = useUser();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifData, setNotifData] = React.useState([]);
  const userType = sessionStorage.getItem("userType");
  const userName = sessionStorage.getItem("userName");
  const [adminMod, setAdminMod] = React.useState(userType === "admin");

  const AppBar = styled(MuiAppBar)(({ theme }) => ({
    color: "white",
    zIndex: theme.zIndex.drawer + 1,
  }));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={themeCustom}>
      <AppBar position="fixed">
        <Toolbar>
          {adminMod ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={props.toggleSidebar} // Función para alternar el Sidebar
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <Typography
            variant={isMobile ? "body1" : "h6"}
            component="div"
            sx={{ flexGrow: 1 }}
          >
            {isMobile ? <br /> : ""} Farmacias WebApp
          </Typography>
          <IconButton size="large" color="inherit" onClick={handleMenu}>
            <Badge badgeContent={notifData.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <NotificationsMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            handleClose={handleClose}
            data={notifData}
            primaryText="No hay notificaciones disponibles."
            secondaryText=""
          />
          <AvatarNab img={noAvatar} user={userName} />
          <Tooltip
            title={
              userType && userType === "administrador"
                ? "Los administradores pueden crear y editar datos"
                : "Los operadores solo pueden visualizar los datos"
            }
          >
            <Typography>
              {userName && userType
                ? `Bienvenido/a, ${
                    userName.charAt(0).toUpperCase() + userName.slice(1)
                  } (${userType === "seller" ? "Vendedor" : "Administrador"})`
                : `Bienvenido/a, Nombre (tipo de usuario)`}
            </Typography>
          </Tooltip>
          <Tooltip title="Salir">
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={logout}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
