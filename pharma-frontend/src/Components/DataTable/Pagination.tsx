import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useTheme } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import Grid from "@mui/material/Grid";
import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { QueryPagination } from "Interfaces/QueryFilters";

type ApiPagination = Partial<QueryPagination>;
interface PaginationProps {
  readonly rowsPerPage: number;
  readonly setRowsPerPage?: (c: number) => void;
  readonly currentPage: number;
  readonly count: number;
  readonly onPageChange?: (value: number) => void;
  readonly paginationValues?: ApiPagination;
  pagination?: ApiPagination;
  readonly filterTenOn?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "20px"
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      backgroundColor: "white"
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    noOfPageSelection: {
      outline: "none",
      background: "#FFFFFF",
      border: `0.5px solid ${theme.palette.gray[300]}`,
      boxShadow: " 0px 1px 2px rgba(0, 0, 0, 0.1)",
      borderRadius: "6px",
      paddingLeft: "5px",
      width: "130px"
    },
    showingText: {
      color: theme.palette.gray[1200],
      marginTop: "6px",
      fontSize: "16px"
    },
    flex: {
      display: "flex"
      // alignItems: "center"
    },
    selectBox: {
      maxWidth: "80%",
      minWidth: "50%",
      height: "40px"
    },
    body: {
      justifyContent: "space-between",
      display: "flex",
      width: "100%"
    }
  })
);
const CustomPagination: React.FC<PaginationProps> = ({
  onPageChange,
  paginationValues,
  setRowsPerPage,
  //eslint-disable-next-line
  pagination,
  filterTenOn
}) => {
  const classes = useStyles();

  const theme = useTheme();

  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container mt={2} rowSpacing={0.5}>
      <Grid
        container
        item
        md={6}
        sm={6}
        xs={12}
        justifyContent={matches ? "center" : "flex-start"}
      >
        <p className={classes.showingText}>Showing</p> &nbsp;&nbsp;
        <div className={classes.selectBox}>
          <Select
            style={{ width: "100%", height: "40px" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={e => setRowsPerPage?.(e.target.value as number)}
            variant="outlined"
            value={paginationValues?.rowsPerPage}
          >
            {filterTenOn && <MenuItem value={10}>10 per page</MenuItem>}

            <MenuItem value={50}>50 per page</MenuItem>

            <MenuItem value={100}>100 per page</MenuItem>

            <MenuItem value={200}>200 per page</MenuItem>

            {/* <MenuItem value={300}>300 per page</MenuItem>

            <MenuItem value={400}>400 per page</MenuItem>

            <MenuItem value={500}>500 per page</MenuItem> */}
            {/* <MenuItem value={1000}>1000 per page</MenuItem> */}
          </Select>
        </div>
      </Grid>

      <Grid
        container
        item
        md={6}
        sm={6}
        xs={12}
        justifyContent={matches ? "center" : "flex-end"}
      >
        <Pagination
          count={Number.parseInt(paginationValues?.pages || "0")}
          variant="outlined"
          shape="rounded"
          showFirstButton
          showLastButton
          defaultPage={Number.parseInt(paginationValues?.page || "1")}
          onChange={(e, p) => onPageChange?.(p)}
        />
      </Grid>
    </Grid>
  );
};

export default CustomPagination;
