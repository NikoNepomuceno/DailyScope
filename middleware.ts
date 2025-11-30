import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for advanced routing logic
 * Handles:
 * - Authentication checks for protected routes
 * - Locale-based redirects
 * - Request logging and analytics
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check for authentication token in cookies or headers
  const authToken = request.cookies.get('auth-token')?.value || 
                    request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Handle locale-based redirects (if needed in future)
  // Example: Redirect /en/* to /* or vice versa
  const locale = request.nextUrl.searchParams.get('locale');
  if (locale && !pathname.startsWith(`/${locale}`)) {
    // Locale handling logic can be added here
  }
  
  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CORS headers (adjust as needed)
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('Access-Control-Allow-Origin', '*');
  }
  
  return response;
}

/**
 * Configure which routes the middleware should run on
 * Use matcher to exclude static files, API routes, etc.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

