import { NextRequest, NextResponse } from 'next/server'

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always let the login page itself through
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Guard everything else under /admin
  if (pathname.startsWith('/admin')) {
    const session = req.cookies.get('admin_session')?.value
    if (session !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}