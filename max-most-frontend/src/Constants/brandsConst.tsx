import { TableColumn } from "react-data-table-component";
import { BrandData } from "../Interfaces/brandType";
import { Box, IconButton, Link, Stack, Typography } from "@mui/material";
import { ModeEdit } from "@mui/icons-material";

type Columns<T> = TableColumn<T>[];
interface BrandsColumnsProps {
  handleEdit(row: BrandData): void;
  handleRestore?(row: BrandData): void;
  isTrash?: boolean;
}
const BrandsColumns = (props: BrandsColumnsProps): Columns<BrandData> => {
  const { handleEdit, handleRestore, isTrash } = props;
  return [
    {
      name: "Name",
      selector: row => row.name,
      cell: row => (
        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <Box component={"img"} src="/assets/refinelogo.svg" alt="" width={40} />
          <Typography>{row?.name}</Typography>
        </Stack>
      ),
      minWidth: "180px"
    },
    {
      name: "Url",
      selector: row => row.url,
      cell: row => {
        return row?.url ? (
          <Typography
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical"
            }}
          >
            <Link href={row?.url} target="_blank" className="underline-hover">
              {row?.url}
            </Link>
          </Typography>
        ) : (
          "---"
        );
      }
    },
    {
      name: "Organization ID",
      selector: row => row.organization_id,
      cell: ({ organization_id }) => <Typography>{organization_id}</Typography>
    },
    {
      name: "Currency",
      cell: row => <Typography>{row?.currency}</Typography>
    },
    {
      name: "Description",
      selector: row => row.description,
      cell: ({ description }) => {
        return (
          <Typography
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical"
            }}
          >
            {description}
          </Typography>
        );
      }
    },
    // {
    //   name: "Action",
    //   cell: row => (
    //     <IconButton onClick={() => handleEdit(row)}>
    //       <ModeEdit color="primary" />
    //     </IconButton>
    //   ),
    //   button: true
    // },
    {
      name: "Action",
      cell: row => {
        return isTrash && handleRestore ? (
          <IconButton onClick={() => handleRestore(row)}>
            <Box component={"img"} src={"/assets/icons/restore-icon.svg"} />
          </IconButton>
        ) : (
          <>
            <IconButton onClick={() => handleEdit(row)}>
              <ModeEdit color="primary" />
            </IconButton>
          </>
        );
      },
      button: true
    }
  ];
};

export { BrandsColumns };
