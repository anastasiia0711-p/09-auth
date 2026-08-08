import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "@/lib/api/serverApi";
import { parseSetCookie } from "cookie";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

interface ParsedCookie {
  name: string;
  value: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none" | boolean;
  path?: string;
  expires?: Date;
  maxAge?: number;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = false;
  const newCookies: ParsedCookie[] = [];

  if (!accessToken && !refreshToken) {
    isAuthenticated = false;
  } else {
    try {
      const response = await checkSession();

      if (response.status >= 200 && response.status < 300) {
        isAuthenticated = true;

        const headers = response.headers;
        const setCookieHeader =
          typeof headers.getSetCookie === "function"
            ? headers.getSetCookie()
            : null;

        if (setCookieHeader) {
          const cookieStrings = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          cookieStrings.forEach((str) => {
            const parsed = parseSetCookie(str);
            if (parsed && parsed.name && parsed.value) {
              newCookies.push({
                name: parsed.name,
                value: parsed.value,
                httpOnly: parsed.httpOnly,
                secure: parsed.secure,
                sameSite: parsed.sameSite as
                  | "lax"
                  | "strict"
                  | "none"
                  | boolean
                  | undefined,
                path: parsed.path,
                expires: parsed.expires,
                maxAge: parsed.maxAge,
              });
            }
          });
        }
      } else {
        isAuthenticated = false;
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
    res.cookies.set({
      name: c.name,
      value: c.value,
      httpOnly: c.httpOnly,
      secure: c.secure,
      sameSite: c.sameSite,
      path: c.path,
      expires: c.expires,
      maxAge: c.maxAge,
    });
  });

  return res;
}

export default proxy;

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
