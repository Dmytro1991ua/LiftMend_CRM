import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

import { ALLOWED_UNAUTHENTICATED_ROUTES } from './types/constants';
import { AppRoutes } from './types/enums';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const reqUrl = req.nextUrl.pathname;

  // Allow Next.js internal requests
  if (reqUrl.startsWith('/_next/static') || reqUrl.startsWith('/_next/image') || reqUrl.startsWith('/_next/data')) {
    return res;
  }

  // Check if the current route is allowed without a session
  const isAllowedUnauthenticated = ALLOWED_UNAUTHENTICATED_ROUTES.some((route) => reqUrl.startsWith(route));

  // When no session exists:
  if (!session) {
    // Allow access to sign-in/up/forgot/reset pages
    if (isAllowedUnauthenticated) {
      return res;
    }

    // For all other pages, redirect to the sign in page
    return NextResponse.redirect(new URL(AppRoutes.SignIn, req.url));
  }

  // When a session exists:
  // Redirect away from auth pages (sign in/up/forgot/reset) to the dashboard
  if (isAllowedUnauthenticated) {
    return NextResponse.redirect(new URL(AppRoutes.Dashboard, req.url));
  }

  // Optionally, if the user is on the default route and authenticated, redirect to dashboard
  if (reqUrl === AppRoutes.Default) {
    return NextResponse.redirect(new URL(AppRoutes.Dashboard, req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico|api/auth).*)'],
};
