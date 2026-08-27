import { useLayoutEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import Loader from './components/loader';
import { supabaseClient } from './services/supabaseService';
import { useAuthStore } from './store/AuthStore';

function App() {
  const { loading, session } = useAuthStore();

  useLayoutEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const jwt = jwtDecode(session.access_token) as any;
        const userRole = jwt.user_role;

        useAuthStore.setState({ session, loading: false, userRole });
      }
    });
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      useAuthStore.setState({ session, loading: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{loading && !session ? <Loader text="Authenticating..." /> : null}</>;
}
export default App;
