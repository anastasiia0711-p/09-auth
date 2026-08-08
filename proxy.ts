import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = request.cookies;

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const cookieHeader = request.headers.get("cookie") || "";

  let isAuthenticated = false;
  let newSetCookieHeaders: string[] = [];

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://notehub-api.goit.study";

  if (accessToken) {
    try {
      const response = await fetch(`${apiUrl}/auth/session`, {
        headers: {
          Cookie: cookieHeader,
        },
      });
      isAuthenticated = response.ok;
    } catch {
      isAuthenticated = false;
    }
  } else if (refreshToken) {
    try {
      const response = await fetch(`${apiUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          Cookie: cookieHeader,
        },
      });

      if (response.ok) {
        isAuthenticated = true;

        const setCookieHeader =
          response.headers.getSetCookie?.() ||
          response.headers.get("set-cookie");
        if (setCookieHeader) {
          newSetCookieHeaders = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  let res = NextResponse.next();

  if (isPrivate && !isAuthenticated) {
    res = NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublic && isAuthenticated) {
    res = NextResponse.redirect(new URL("/", request.url));
  }

  if (newSetCookieHeaders.length > 0) {
    newSetCookieHeaders.forEach((cookieStr) => {
      res.headers.append("Set-Cookie", cookieStr);
    });
  }

  return res;
}

export default proxy;

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
