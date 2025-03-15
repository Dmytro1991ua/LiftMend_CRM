import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  const supabase = createPagesServerClient({ req, res });
  const { error } = await supabase.auth.exchangeCodeForSession(String(code));

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.redirect(302, '/auth/callback');
};

export default handler;
