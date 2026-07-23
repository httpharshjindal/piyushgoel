import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_TOKEN = "af32f2!@#jaf98374883haasf789";
const AUTH_COOKIE = "admin_auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin?pass=xxx → set cookie and redirect to /admin
  if (pathname === "/admin" && request.nextUrl.searchParams.get("pass") === ADMIN_TOKEN) {
    const response = NextResponse.redirect(new URL("/admin", request.url));
    response.cookies.set(AUTH_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
    return response;
  }

  // /admin/{token} → set cookie and redirect to /admin
  if (pathname.startsWith("/admin/")) {
    const token = pathname.replace("/admin/", "");
    if (token === ADMIN_TOKEN) {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.set(AUTH_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });
      return response;
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // /admin without auth → redirect to /
  if (pathname === "/admin") {
    if (!request.cookies.has(AUTH_COOKIE)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
