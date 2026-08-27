import { TableColumn } from "react-data-table-component";
import { IconButton } from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { WarningMessageList } from "../Interfaces/warningMessageType";

type Columns<T> = TableColumn<T>[];
type Props = {
  handleEdit(row: WarningMessageList): void;
};

const WarningColumns = (props: Props): Columns<WarningMessageList> => {
  const { handleEdit } = props;

  return [
    {
      name: "Warning #",
      selector: row => row.warningNumber,
      sortable: true
    },
    {
      name: "Warning Message",
      selector: row => row.message,
      sortable: true
    },

    {
      name: "Action",
      cell(row) {
        return (
          <IconButton
            onClick={() => {
              handleEdit(row);
            }}
          >
            <ModeEditIcon color="primary" />
          </IconButton>
        );
      },
      button: true
    }
  ];
};

export { WarningColumns };
