import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiHandler } from 'next';

import { AppRoutes } from '@/types/enums';

const handler: NextApiHandler = async (req, res) => {
  const { code } = req.query;

  if (code) {
    const supabase = createPagesServerClient({ req, res });
    await supabase.auth.exchangeCodeForSession(String(code));
  }

  res.redirect(AppRoutes.Dashboard);
};

export default handler;
