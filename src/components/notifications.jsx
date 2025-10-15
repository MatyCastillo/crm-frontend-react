import React from "react";
import Menu from "@mui/material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import Divider from "@mui/material/Divider";
import { ListSubheader,Typography } from "@mui/material";

const NotificationsMenu = (props) => {
  const { anchorEl, open, primaryText, secondaryText, handleClose, data } =
    props;

  const notificColor = (nivel) => {
    if (nivel === 1) {
      return "primary";
    } else if (nivel === 2) {
      return "success";
    } else if (nivel === 3) {
      return "secondary";
    }
  };

  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={open}
      onClose={handleClose}
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
        subheader={
          <>
            <ListSubheader component="div">
              <Typography variant="h6" fontWeight="bold">
                Nuevas actualizaciones
              </Typography>
            </ListSubheader>
            <Divider component="li" />
          </>
        }
      >
        {data.length > 0 ? (
          data.map((notification, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={notification.titulo}
                  secondary={notification.descripcion}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))
        ) : (
          <ListItem alignItems="flex-start">
            <ListItemText primary={primaryText} secondary={secondaryText} />
          </ListItem>
        )}
      </List>
    </Menu>
  );
};

export default NotificationsMenu;
