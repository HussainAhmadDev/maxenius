import { TableColumn } from "react-data-table-component";
import { Box, IconButton, Radio, Typography } from "@mui/material";
import { Fridge } from "@interfaces/Fridges";
import { DeleteForever } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
type Columns = TableColumn<Fridge>[];

type Props = {
  handleDelete(row: Fridge): void;
  handleRestore?(row: Fridge): void;
  isTrash?: boolean;
  onUpdate(row: Fridge): void;
};

const fidgeListColumns = (props: Props): Columns => {
  const { handleDelete, handleRestore, isTrash, onUpdate } = props;

  return [
    {
      name: "Fridge#",
      selector: row => `${row?.fridge_number}`,
      sortable: true,
      cell: row => <Typography color={"primary.main"}>{row.fridge_number}</Typography>,
      maxWidth: "200px"
    },

    {
      name: "Description",
      selector: row => row?.description,
      sortable: true,
      cell: row => <Typography id="cy__ProductName">{row?.description}</Typography>
    },
    {
      name: "Location",
      selector: row => row?.location,
      sortable: true,
      cell: row => <Typography id="cy__ProductName">{row?.location}</Typography>
    },
    // {
    //   name: "Active",
    //   selector: row => row?.is_active,
    //   sortable: true,
    //   cell: row => (
    //     <Typography id="cy__ProductName">
    //       {row?.is_active === true ? "true" : "false"}
    //     </Typography>
    //   )
    // },

    {
      name: "Active",
      cell: ({ is_active }: { is_active: boolean }) => {
        return <Radio checked={is_active} size="medium" />;
      },
      button: true
    },
    {
      name: "Action",
      cell: row => {
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
    }
  ];
};

export { fidgeListColumns };
