import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/shadcn/registry/utils";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle registry routes - only token validation, no session updates
  if (pathname.startsWith("/registry/")) {
    return handleRegistryRoute(request);
  }

  // For all other routes, just update session if needed
  return await updateSession(request);
}

async function handleRegistryRoute(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow access to license validation pages without token
  if (pathname === "/registry/access/validate-license") {
    return NextResponse.next();
  }

  // Allow access to license validation API without token (POST only)
  if (
    pathname === "/registry/api/validate-license" &&
    request.method === "POST"
  ) {
    return NextResponse.next();
  }

  // Get the authorization token from ?token=
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL(
        "/registry/access/validate-license?return=" +
          encodeURIComponent(pathname),
        request.url
      )
    );
  }

  const isValidToken = await verifyToken(token);

  if (!isValidToken) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  // For valid registry requests, just continue without session updates
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/registry/:path*",
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
