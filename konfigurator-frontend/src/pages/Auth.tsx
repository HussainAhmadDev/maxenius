import { Navigate } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import Loader from '@/components/loader';
import { languageData } from '@/constants';
import { supabaseClient } from '@/services/supabaseService';
import { useAuthStore } from '@/store/AuthStore';

function AuthPage() {
  const { session, loading } = useAuthStore();

  if (!session && loading) {
    return <Loader text="Authenticating..." />;
  } else if (!session) {
    return (
      <Box>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item xs={4}>
            <Auth
              supabaseClient={supabaseClient}
              providers={[]}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              view="sign_in"
              localization={{
                variables: {
                  ...languageData.auth,
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    );
  } else {
    return <Navigate to="/dashboard/all-projects" />;
  }
}

export default AuthPage;
