import { NextResponse } from 'next/server'

// This middleware.js file is required by Next.js when present
// You can either remove this file or add actual middleware logic

export function middleware(request) {
  // Add any middleware logic here if needed
  return NextResponse.next();
}

// Optionally specify which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}