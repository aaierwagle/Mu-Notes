import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  // Function that runs after authentication check
  function middleware(req) {
    // Get the pathname
    const path = req.nextUrl.pathname

    // Protect admin routes - only allow specific roles
    if (path.startsWith('/admin') && req.nextauth.token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Return true if the request should proceed
      authorized: ({ req, token }) => {
        if (!token) {
          return false
        }
        return true
      }
    }
  }
)

// Configure which routes to protect
export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard',
    '/profile/:path*',
    '/admin/:path*',
    '/api/notes',
    '/settings/:path*',
    
    // Exclude auth-related routes
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ]
}