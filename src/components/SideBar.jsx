import React, { useState, useEffect } from "react";
import {
  Box,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Collapse,
  Dialog,
  Badge,
} from "@mui/material";
import { renderIcon } from "../utils/dynamicIconLoader";
import { capitalizeFirstLetter } from "../utils/helper";
import { Link } from "react-router-dom";
import AddEmployee from "../components/AddEmployee";
import AddPatient from "../components/AddPatient";
import { getUpcommingExpirationPrescriptions } from "../services";

export default function Sidebar({ openSideBar, location, sidebarItems }) {
  const [open, setOpen] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [ModalContent, setModalContent] = useState(null);
  const [expirationCount, setExpirationCount] = useState("");

  const fetchExpires = async () => {
    try {
      const response = await getUpcommingExpirationPrescriptions();
      setExpirationCount(response.length);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  useEffect(() => {
    fetchExpires();
  }, []);

  const handleDropdownClick = (index, event) => {
    event.stopPropagation();
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
  };

  const handleOpenModal = (Component) => {
    setModalContent(() => Component);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleModalSuccess = () => {
    handleCloseModal();
    // Aquí puedes agregar lógica adicional, como actualizar la lista de empleados
  };

  return (
    <Box sx={{ width: 250 }} role="presentation">
      <Toolbar />
      <List>
        {sidebarItems.header.map((item, index) => (
          <Tooltip title={item.title} key={index}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: openSideBar ? "initial" : "center",
                px: 2.5,
              }}
              onClick={(event) => {
                if (item.route === "modal") {
                  event.preventDefault();
                  const Component =
                    item.component === "AddEmployee" ? AddEmployee : AddPatient;
                  handleOpenModal(Component);
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: openSideBar ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {renderIcon(item.icon)}
              </ListItemIcon>
              <ListItemText
                primary={capitalizeFirstLetter(item.title)}
                sx={{ opacity: openSideBar ? 1 : 0 }}
              />
            </ListItemButton>
          </Tooltip>
        ))}
        <Divider />
        {sidebarItems.body.map((item, index) => (
          <div key={index}>
            <ListItemButton
              component={item.route ? Link : "div"}
              to={item.route || ""}
              onClick={(event) => {
                if (!item.route) {
                  event.preventDefault(); // Prevenir recarga si no hay ruta
                  handleDropdownClick(index, event);
                }
              }}
              sx={{
                minHeight: 48,
                justifyContent: openSideBar ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: openSideBar ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {renderIcon(item.icon)}
              </ListItemIcon>
              <ListItemText
                primary={capitalizeFirstLetter(item.title)}
                sx={{ opacity: openSideBar ? 1 : 0 }}
              />
              {item.type === "notification" ? (
                <Badge
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  badgeContent={expirationCount}
                  color="error"
                ></Badge>
              ) : (
                ""
              )}
              {item.dropdown
                ? open[index]
                  ? renderIcon("ExpandLess")
                  : renderIcon("ExpandMore")
                : null}
            </ListItemButton>
            {item.dropdown && (
              <Collapse in={open[index]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.dropdown.map((dropdownItem, dropdownIndex) => (
                    <Tooltip title={dropdownItem.title} key={dropdownIndex}>
                      <ListItemButton
                        component={dropdownItem.route ? Link : "div"}
                        selected={location.pathname === `${dropdownItem.route}`}
                        to={dropdownItem.route || ""}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon>
                          {renderIcon(dropdownItem.icon)}
                        </ListItemIcon>
                        <ListItemText
                          primary={capitalizeFirstLetter(dropdownItem.title)}
                        />
                      </ListItemButton>
                    </Tooltip>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>

      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md">
        {ModalContent && <ModalContent onSubmitSuccess={handleModalSuccess} />}
      </Dialog>
    </Box>
  );
}
