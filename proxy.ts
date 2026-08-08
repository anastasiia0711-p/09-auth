import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession, refreshSession } from "@/lib/api/serverApi";
import { parseSetCookie } from "cookie";

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

  let isAuthenticated = false;
  const newCookies: ParsedCookie[] = [];

  if (accessToken) {
    try {
      const response = await checkSession();
      isAuthenticated = response.status >= 200 && response.status < 300;
    } catch {
      isAuthenticated = false;
    }
  } else if (refreshToken) {
    try {
      const response = await refreshSession();

      if (response.status >= 200 && response.status < 300) {
        isAuthenticated = true;

        const headers = response.headers;
        const setCookieHeader =
          typeof headers.getSetCookie === "function"
            ? headers.getSetCookie()
            : headers["set-cookie"];

        if (setCookieHeader) {
          const cookieStrings = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          cookieStrings.forEach((str) => {
            const parsed = parseSetCookie(str);
            if (parsed && parsed.name && parsed.value) {
              newCookies.push({ name: parsed.name, value: parsed.value });
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
