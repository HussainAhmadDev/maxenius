import { TableColumn } from "react-data-table-component";
import { Button, Palette } from "@mui/material";

import Chip from "../Components/Chip";

import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import { Patient } from "../Interfaces/patientTypes";

dayjs.extend(utc);

type Columns<T> = TableColumn<T>[];
type Props = {
  handleView(row: Patient): void;
};

const PatientColumns = (props: Props): Columns<Patient> => {
  const { handleView } = props;

  return [
    {
      name: " Name",
      sortable: true,
      cell: row => {
        return (
          <Button
            variant="text"
            color="primary"
            onClick={() => handleView(row)}
            sx={{
              justifyContent: "start !important",
              textAlign: "left !important"
            }}
            size="small"
          >
            {row?.name}
          </Button>
        );
      },
      style: { minWidth: "140px" }
    },

    {
      name: "Date Of Birth",
      selector: row => `${row?.date_of_birth ? row?.date_of_birth : "---"}`,
      sortable: true
    },
    {
      name: "Managed By",
      selector: row => (row?.prescriber ? row?.prescriber : "---"),
      sortable: true,
      style: { minWidth: "150px" }
    },
    {
      name: "Managed By Contact",
      selector: row => row?.prescriber_phone,
      sortable: true
    },

    {
      name: "Address",
      selector: row => row?.address || "",
      cell: row => {
        const status = row?.address;
        let color: keyof Palette;

        switch (status) {
          case "not_shipped":
            color = "error";
            break;
          case "partially_shipped":
            color = "warning";
            break;
          default:
            color = "success";
        }

        return (
          <Chip
            label={status?.replace(/_/g, " ")?.toUpperCase()}
            color={color}
            variant="filled"
            size="small"
          />
        );
      },
      sortable: true,
      style: { minWidth: "160px" }
    }
  ];
};

export { PatientColumns };
