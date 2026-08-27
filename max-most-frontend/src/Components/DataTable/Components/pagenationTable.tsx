import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { CardActions, Pagination, PaginationItem } from "@mui/material";
import { ArrowRightAlt, KeyboardBackspace } from "@mui/icons-material";

interface PaginationValues {
  page: number;
  pages: number;
  rowsPerPage: number;
  total: number;
}

const rowsPerPageList = [10, 50, 100, 200];

const NumberPagination: React.FC<{
  rowsPerPage: number;
  paginationValues: PaginationValues;
  onPageChange: (page: number) => void;
  setRowsPerPage?: (rowsPerPage: number) => void;
  loading: boolean;
}> = ({ paginationValues, onPageChange, setRowsPerPage, loading }) => {
  return (
    <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={e => setRowsPerPage && setRowsPerPage(Number(e.target.value))}
        variant="outlined"
        value={paginationValues.rowsPerPage ?? 10}
        size="small"
        sx={{ minWidth: 170 }}
        disabled={loading}
      >
        {rowsPerPageList
          .filter(option => option !== paginationValues?.rowsPerPage)
          .map(option => (
            <MenuItem key={option} value={option}>
              {option} per page
            </MenuItem>
          ))}
        <MenuItem value={paginationValues.rowsPerPage}>
          {paginationValues.rowsPerPage} per page
        </MenuItem>
      </Select>
      <Pagination
        count={paginationValues.pages}
        variant="outlined"
        shape="rounded"
        page={paginationValues.page}
        disabled={loading}
        onChange={(_e, p) => {
          onPageChange(p);
        }}
        renderItem={item => (
          <PaginationItem
            {...item}
            components={{
              next: () => (
                <>
                  <span style={{ color: "black", fontWeight: "bolder" }}>Next</span>
                  <ArrowRightAlt
                    sx={{
                      color:
                        Number(paginationValues.page) === Number(paginationValues.pages)
                          ? "common.black"
                          : "primary.main"
                    }}
                  />
                </>
              ),
              previous: () => (
                <>
                  <KeyboardBackspace
                    sx={{
                      color:
                        Number(paginationValues.page) === 1
                          ? "common.black"
                          : "primary.main"
                    }}
                  />
                  <span style={{ color: "black", fontWeight: "bolder" }}>Previous</span>
                </>
              )
            }}
          />
        )}
      />
    </CardActions>
  );
};

export default NumberPagination;
