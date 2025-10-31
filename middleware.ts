import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('Middleware running for:', request.nextUrl.pathname)

  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Admin route detected:', request.nextUrl.pathname)

    // Check for admin authorization
    const adminKey = request.headers.get('x-admin-key') || request.cookies.get('admin-session')?.value
    const validAdminKey = process.env.ADMIN_ACCESS_KEY || 'synura-admin-2024'

    console.log('Admin key from request:', adminKey)
    console.log('Valid admin key:', validAdminKey)

    if (adminKey !== validAdminKey) {
      console.log('Redirecting to login page')
      // Redirect to login page or return unauthorized
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    console.log('Access granted to admin route')
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin(.*)$'
}