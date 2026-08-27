import { languageData } from '@/constants';
import { Project } from '@/types/Project';

export const data = [
  {
    id: 1,
    calories: 305,
    name: 'Cupcake',
    city: 'Izaiahport',
    status: 'Finished',
    userFullName: 'User Full Name',
  },
  {
    id: 2,
    calories: 452,
    name: 'Donut',
    city: 'Strackeside',
    status: 'in Progress',
    userFullName: 'User Full Name',
  },
  {
    id: 3,
    calories: 262,
    name: 'Eclair',
    city: 'Texas City',
    status: 'Finished',
    userFullName: 'User Full Name',
  },
  {
    id: 4,
    calories: 262,
    name: 'Eclair',
    city: 'Texas City',
    status: 'in Progress',
    userFullName: 'User Full Name',
  },
  {
    id: 5,
    calories: 356,
    name: 'Gingerbread',
    city: 'Texas City',
    status: 'in Progress',
    userFullName: 'User Full Name',
  },
  {
    id: 6,
    calories: 408,
    name: 'Honeycomb',
    city: 'Texas City',
    status: 'Finished',
    userFullName: 'User Full Name',
  },
  {
    id: 7,
    calories: 237,
    name: 'Ice cream sandwich',
    city: 'Texas City',
    status: 'in Progress',
    userFullName: 'User Full Name',
  },
];
interface HeadCell {
  disablePadding: boolean;
  id: keyof Project;
  label: string;
  numeric: boolean;
  sortable?: boolean;
}

const { columns } = languageData.dashboard.table;

export const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: columns.id,
    sortable: true,
  },
  {
    id: 'projectName',
    numeric: true,
    disablePadding: false,
    label: columns.projectName,
    sortable: true,
  },
  {
    id: 'location',
    numeric: true,
    disablePadding: false,
    label: columns.location,
    sortable: true,
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: columns.status,
  },
  {
    id: 'sales',
    numeric: true,
    disablePadding: false,
    label: columns.sales,
    sortable: true,
  },

  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    label: columns.action,
  },
];

function createData(
  id: string | number,
  name: number,
  projectName: string,
  location: string,
  status: string,
  sales: string,
  ...action: JSX.Element[]
): Project {
  return {
    id,
    name,
    projectName,
    location,
    status,
    sales,
    action,
  };
}

export const rows: Project[] = [];

for (const item of data) {
  rows.push(
    createData(
      item.id,
      item.calories,
      item.name,
      item.city,
      item.status,
      item.userFullName,
    ),
  );
}
