import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiHandler } from 'next';

import prisma from '@/prisma/db';

import { parseOAuthFullName } from '../graphql/utils/utils';

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

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    return res.status(401).json({ error: 'User not found in session' });
  }

  const { firstName, lastName } = parseOAuthFullName(user.user_metadata.full_name);
  const avatarUrl = user.user_metadata?.avatar_url || '';

  const existingUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email ?? '',
        firstName,
        lastName,
        phone: user.user_metadata?.phone || '',
        avatarUrl,
        createdAt: new Date(),
      },
    });

    return res.redirect(302, '/auth/callback');
  }

  // If the user exists but already has an avatar, or if there's no avatarUrl to update, exit.
  if (existingUser.avatarUrl || !avatarUrl) {
    return res.redirect(302, '/auth/callback');
  }

  // Otherwise, update the avatarUrl.
  await prisma.user.update({
    where: { id: user.id },
    data: { avatarUrl },
  });

  res.redirect(302, '/auth/callback');
};

export default handler;
