import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|favicon.ico).*)',
  ],
}

export async function middleware(req) {
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  // Allow the req if the following is true...
  // 1) Its a req for next-auth session & provider fetching
  // 2) the token exists
  if (req.nextUrl.pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // If the user manually types login in the search box it will redirect to homescreen
  // if(token && req.nextUrl.pathname === '/login'){
  //   return NextResponse.redirect(new URL('/index', req.nextUrl));
  // }

  // Redirect them to login if they dont have token AND are requesting a protected route
  if(!token && req.nextUrl.pathname !== '/login'){
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
}
