import { Navigate } from 'react-router-dom';

import Loader from '@/components/loader';
import { useAuthStore } from '@/store/AuthStore';
import { useEditorStore } from '@/store/EditorStore';

type ProjectProtectionWrapperProps = {
  children: React.ReactElement;
};

const ProjectProtectionWrapper = ({ children }: ProjectProtectionWrapperProps) => {
  const { loading, userRole } = useAuthStore();
  const { projectData } = useEditorStore();
  if (loading) {
    return <Loader text="Authenticating..." />;
  }

  return userRole === 'outer_sales_agent' && projectData?.locked ? (
    <Navigate to="/dashboard/all-projects" replace />
  ) : (
    children
  );
};

export default ProjectProtectionWrapper;
