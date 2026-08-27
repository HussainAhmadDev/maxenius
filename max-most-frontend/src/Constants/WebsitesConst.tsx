import { TableColumn } from "react-data-table-component";
import { Box, Button, IconButton } from "@mui/material";
import {
  // DeleteForever,
  ModeEdit
} from "@mui/icons-material";

import { Website } from "../Interfaces/webstiteType";

type Columns = TableColumn<Website>[];

type Props = {
  // handleDelete(row: Website): void;
  handleView(row: Website): void;
  handleEdit(row: Website): void;
  handleRestore?(row: Website): void;
  isTrash?: boolean;
};
const WebsiteColumn = (props: Props): Columns => {
  const {
    // handleDelete,
    handleView,
    handleEdit,
    handleRestore,
    isTrash
  } = props;
  return [
    {
      name: "Title",
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
            {row.title}
          </Button>
        );
      }
    },
    {
      name: "Website URL",
      selector: row => row.site_url,
      sortable: true,
      minWidth: "190px"
    },
    {
      name: "Brand #",
      selector: row => row.brand_id,
      sortable: true
    },
    {
      name: "Organization #",
      selector: row => row.organization_id,

      sortable: true
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
            {/* <IconButton onClick={() => handleDelete(row)}>
              <DeleteForever sx={{ color: "error.main" }} />
            </IconButton> */}
            <IconButton onClick={() => handleEdit(row)}>
              <ModeEdit sx={{ color: "primary.main" }} />
            </IconButton>
          </>
        );
      },
      button: true
    }
  ];
};

export { WebsiteColumn };
