import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const [subdomain] = host.split('.')
  // Ignore www and root domain
  if (subdomain && subdomain !== 'www' && !host.startsWith('localhost')) {
    // Set subdomain as a cookie for org context
    const response = NextResponse.next()
    response.cookies.set('org_subdomain', subdomain, { path: '/' })
    return response
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|api|static|favicon.ico).*)',
  ],
} 