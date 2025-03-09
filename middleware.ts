import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

import { AppRoutes } from './types/enums';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  await supabase.auth.getSession();

  const reqUrl = req.nextUrl.pathname;

  const token = req ? req.cookies?.get('sb-qgaqvfqcyjcewjnntzci-auth-token') : null;

  if (reqUrl.startsWith('/_next')) return NextResponse.next();

  if (token && reqUrl === AppRoutes.Default) {
    const clonedUrl = req.nextUrl.clone();

    clonedUrl.pathname = AppRoutes.Dashboard;

    return NextResponse.redirect(clonedUrl);
  }

  if (!token && (reqUrl.startsWith(AppRoutes.SignIn) || reqUrl.startsWith(AppRoutes.SignUp))) {
    return NextResponse.next();
  }

  if ((reqUrl.includes(AppRoutes.SignIn) || reqUrl.includes(AppRoutes.SignUp)) && token) {
    return NextResponse.redirect(new URL(AppRoutes.Dashboard, req.url));
  }

  if (
    !token &&
    !(
      reqUrl.includes(AppRoutes.SignIn) ||
      reqUrl.includes(AppRoutes.SignUp) ||
      reqUrl.includes(AppRoutes.ResetPassword) ||
      reqUrl.includes(AppRoutes.ForgotPassword)
    )
  ) {
    return NextResponse.redirect(new URL(AppRoutes.SignIn, req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico|api/auth).*)'],
};
