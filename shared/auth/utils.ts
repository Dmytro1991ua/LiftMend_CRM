import { Session } from '@supabase/supabase-js';

export const getUserName = (session: Session | null) => {
  return `Welcome back, ${session?.user.user_metadata.full_name || session?.user.email}!`;
};
