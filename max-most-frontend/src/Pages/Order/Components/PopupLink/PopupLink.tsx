import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";

interface PopupLinkProps {
  icon: React.ReactElement;
  link: string;
}

const PopupLink: React.FC<PopupLinkProps> = ({ icon, link }) => {
  return (
    <ListItem disablePadding>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={link} />
    </ListItem>
  );
};

export default PopupLink;
