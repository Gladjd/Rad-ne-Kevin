import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Process and refresh Supabase session cookies
  const { response, user, role } = await updateSession(request);

  // Check if target is login route
  const isLoginPage = pathname === '/admin/login';

  // 1. If accessing login page while already authenticated
  if (isLoginPage) {
    if (user) {
      if (role === 'PROTOCOLE') {
        return NextResponse.redirect(new URL('/admin/scanner', request.url));
      }
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return response;
  }

  // 2. Protected admin routes
  if (pathname.startsWith('/admin')) {
    // If user is not authenticated, redirect to login page
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 3. RBAC Enforcement: PROTOCOLE role can ONLY access /admin/scanner
    if (role === 'PROTOCOLE' && !pathname.startsWith('/admin/scanner')) {
      return NextResponse.redirect(new URL('/admin/scanner', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths starting with /admin
     */
    '/admin/:path*',
  ],
};
