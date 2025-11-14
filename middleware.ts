// frontend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * NOTE:
 * Supabase stores session in localStorage by default for client-side usage.
 * This middleware uses a heuristic: it looks for a Supabase session cookie 'sb-access-token'
 * If you configured Supabase to store session cookies via server helpers, this will work reliably.
 * For demo/demo-protection this is acceptable; for production use server-side session checks.
 */

const PUBLIC_FILE = /\.(.*)$/;
const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/_next",
  "/api",
  "/favicon.ico",
  "/"
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow public files + paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p)) || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  // Check for a supabase access token cookie (if using cookie auth)
  const tokenCookie = req.cookies.get("sb-access-token")?.value;

  if (!tokenCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
