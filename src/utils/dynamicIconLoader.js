import * as Icons from "@mui/icons-material";

const renderIcon = (iconName) => {
  const IconComponent = Icons[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" no encontrado en @mui/icons-material.`);
    return null;
  }
  return <IconComponent />;
};

export {renderIcon}