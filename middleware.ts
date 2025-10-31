import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for admin authorization
    const adminKey = request.headers.get('x-admin-key') || request.cookies.get('admin-session')?.value
    const validAdminKey = process.env.ADMIN_ACCESS_KEY || 'synura-admin-2024'

    if (adminKey !== validAdminKey) {
      // Redirect to login page or return unauthorized
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}