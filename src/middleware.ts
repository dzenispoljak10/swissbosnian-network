import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { auth } from './lib/auth'
import { NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default auth((req) => {
  const { pathname } = req.nextUrl

  // API routes: skip
  if (pathname.startsWith('/api')) return NextResponse.next()

  // Admin routes: skip intl, check auth (except login page)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname === '/admin') {
      const res = NextResponse.next()
      res.headers.set('x-pathname', pathname)
      return res
    }
    if (!req.auth) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    const res = NextResponse.next()
    res.headers.set('x-pathname', pathname)
    return res
  }

  // Public routes: apply i18n
  return intlMiddleware(req)
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
