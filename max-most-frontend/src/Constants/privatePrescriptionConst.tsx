import { Website } from "../Interfaces/Company";

import { TableColumn } from "react-data-table-component";

type Columns<T> = TableColumn<T>[];

const PrivatePrescriptionColumns: Columns<Website> = [
  {
    name: "Website Name",
    selector: row => row?.title,
    sortable: false
  },
  {
    name: "Website URL",
    selector: row => row?.site_url,
    sortable: false
  }
];

export { PrivatePrescriptionColumns };
