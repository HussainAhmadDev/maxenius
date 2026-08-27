import * as React from "react";
import Alert from "@mui/material/Alert";

type alertType = "error" | "warning" | "info" | "success";

interface IProps {
  type: alertType;
  text?: string;
  show: boolean;
}
const BasicAlerts: React.FC<IProps> = props => {
  const [show, setShow] = React.useState(props.show);
  return show ? (
    <div
      style={{
        position: "sticky",
        top: 95,
        zIndex: 1
      }}
    >
      <Alert severity={props.type} variant="filled" onClose={() => setShow(false)}>
        {props.text}
      </Alert>
    </div>
  ) : null;
};
export default BasicAlerts;
