import { useLoaderData } from 'react-router-dom';

import { DataTable } from '@/components';
import { ProjectResponse } from '@/types/Project';

const FinishedProjects = () => {
  const data = useLoaderData() as { totalRows: number; data: ProjectResponse[] };

  return <DataTable data={data?.data} totalRows={data?.totalRows} />;
};

export default FinishedProjects;
