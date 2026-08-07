import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Приватні сторінки, доступні лише авторизованим
const privateRoutes = ["/profile", "/notes"];

const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieHeader = request.headers.get("cookie") || "";

  let isAuthenticated = false;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://notehub-api.goit.study"}/auth/session`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
    isAuthenticated = response.ok;
  } catch {
    isAuthenticated = false;
  }

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
