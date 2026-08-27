import { TableStyles } from "react-data-table-component";

const customStyles: TableStyles = {
  table: {
    style: {
      "div[data-tag='allowRowEvents'],[data-column-id]": {
        whiteSpace: "unset !important"
      }
    }
  },
  headCells: {
    style: {
      fontWeight: "bold"
    }
  },
  cells: {
    style: {}
  }
};

export default customStyles;
