import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

type UserRoles =
  | 'super_admin'
  | 'outer_sales_agent'
  | 'inner_sales_agent'
  | 'general_user';
interface AuthState {
  session: Session | null;
  loading: boolean;
  userRole: UserRoles | null;
  setUserRole: (userRole: UserRoles) => void;
  setLoading: (loading: boolean) => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  loading: true,
  userRole: null,
  setLoading: (loading) => set({ loading }),
  setSession: (session) => set({ session }),
  setUserRole: (userRole) => set({ userRole }),
}));

export type { UserRoles };
