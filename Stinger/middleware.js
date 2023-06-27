import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico).*)",
  ],
};

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL(req.nextUrl.origin, req.nextUrl));
  }

  if (req.nextUrl.pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
}
