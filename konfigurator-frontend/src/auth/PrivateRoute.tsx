import { Navigate } from 'react-router-dom';

import Loader from '@/components/loader';
import { useAuthStore } from '@/store/AuthStore';

type PrivateWrapperProps = {
  children: React.ReactElement;
};

const PrivateWrapper = ({ children }: PrivateWrapperProps) => {
  const { session, loading } = useAuthStore();
  if (loading) {
    return <Loader text="Authenticating..." />;
  }

  return session?.user ? children : <Navigate to="/auth" replace />;
};

export default PrivateWrapper;
