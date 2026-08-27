import { TableColumn } from "react-data-table-component";
import { Box, IconButton, Typography } from "@mui/material";
import { FridgeLogs } from "@interfaces/Fridges";
import { DeleteForever } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { User } from "@interfaces/usersType";

type Columns = TableColumn<FridgeLogs>[];

type Props = {
  handleDelete(row: FridgeLogs): void;
  handleRestore?(row: FridgeLogs): void;
  isTrash?: boolean;
  onUpdate(row: FridgeLogs): void;
  user: User | null;
};

const fidgeLogColumns = (props: Props): Columns => {
  const { handleDelete, handleRestore, isTrash, onUpdate, user } = props;

  const columns: Columns = [
    {
      name: "Fridge #",
      selector: row => `${row?.fridge_number}`,
      sortable: true,
      cell: row => <Typography color={"primary.main"}>{row.fridge_number}</Typography>,
      maxWidth: "200px"
    },
    {
      name: "AM/PM",
      selector: row => row["AM/PM"],
      sortable: true,
      cell: row => <Typography id="cy__ProductName">{row["AM/PM"]}</Typography>
    },
    {
      name: "Entry Date",
      selector: row => row?.entry_date,
      sortable: true,
      cell: row => <Typography id="cy__ProductName">{row?.entry_date}</Typography>
    },
    {
      name: "Entry Time",
      selector: row => row?.entry_time,
      sortable: true,
      cell: row => <Typography id="cy__ProductName">{row?.entry_time}</Typography>
    },

    {
      name: "Max Temp",
      selector: row => row?.max_temp,
      sortable: true,
      cell: row => <Typography id="cy__ProductName">{row?.max_temp}</Typography>
    },
    {
      name: "Min Temp",
      selector: row => row?.min_temp,
      sortable: true,
      cell: row => <Typography id="cy__ProductName">{row?.min_temp}</Typography>
    },
    {
      name: "Room Temp",
      selector: row => row?.room_temp,
      sortable: true,
      cell: row => <Typography id="cy__ProductName">{row?.room_temp}</Typography>
    },
    {
      name: "Notes",
      selector: row => row?.notes,
      sortable: true,
      cell: row => <Typography id="cy__ProductName">{row?.notes}</Typography>
    }
  ];

  if (user?.is_superuser) {
    columns.push({
      name: "Action",
      cell: (row: FridgeLogs) => {
        return isTrash && handleRestore ? (
          <IconButton onClick={() => handleRestore(row)}>
            <Box component={"img"} src={"/assets/icons/restore-icon.svg"} />
          </IconButton>
        ) : (
          <>
            <IconButton onClick={() => onUpdate(row)} size="small">
              <EditIcon color="primary" />
            </IconButton>

            <IconButton onClick={() => handleDelete(row)}>
              <DeleteForever color="error" />
            </IconButton>
          </>
        );
      },
      button: true
    });
  }

  return columns;
};

export { fidgeLogColumns };
