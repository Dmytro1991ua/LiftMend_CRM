import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export const getSupabaseServer = (req: NextApiRequest, res: NextApiResponse) => {
  return createPagesServerClient({
    req,
    res,
  });
};
