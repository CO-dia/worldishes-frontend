import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Example: Check if the user is authenticated
  const token = request.cookies.get("next-auth.session-token")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/api/auth/signin?callbackUrl=%2Frecipes", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/recipes/new"],
};
