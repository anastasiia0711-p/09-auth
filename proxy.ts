import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

interface ParsedCookie {
  name: string;
  value: string;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const cookieHeader = request.headers.get("cookie") || "";

  let isAuthenticated = false;
  const newCookies: ParsedCookie[] = [];

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
          const cookieStrings = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          cookieStrings.forEach((str) => {
            const [pair] = str.split(";");
            const [name, value] = pair.split("=");
            if (name && value) {
              newCookies.push({ name: name.trim(), value: value.trim() });
            }
          });
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
  } else if (isPublic && isAuthenticated) {
    res = NextResponse.redirect(new URL("/", request.url));
  }

  newCookies.forEach((c) => {
    res.cookies.set(c.name, c.value, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  });

  return res;
}

export default proxy;

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
