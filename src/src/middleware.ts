import { NextRequest, NextResponse } from "next/server";

// Rutas que requieren sesión activa
const PROTECTED = ["/dashboard", "/riders"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // NextAuth v5 usa "authjs.session-token" (dev) o "__Secure-authjs.session-token" (prod)
  const token =
    req.cookies.get("authjs.session-token") ??
    req.cookies.get("__Secure-authjs.session-token");

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
