import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/shadcn/registry/utils";

// Routes that require authentication
const AUTHENTICATED_ROUTES = ["/dashboard", "/portal", "/checkout", "/subscription"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle registry UI routes - only token validation, no session updates
  if (pathname.startsWith("/registry/")) {
    return handleRegistryRoute(request);
  }

  // Handle static registry files - differentiate between free and pro
  if (pathname.startsWith("/r/")) {
    return handleStaticRegistryFiles(request);
  }

  // Handle API registry routes - differentiate between free and pro
  if (pathname.startsWith("/api/registry/")) {
    return handleApiRegistryRoutes(request);
  }

  // Only require authentication for specific routes
  if (AUTHENTICATED_ROUTES.some(route => pathname.startsWith(route))) {
    return await updateSession(request);
  }

  // For all other routes (homepage, docs, etc.), just continue without authentication
  return NextResponse.next();
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

async function handleStaticRegistryFiles(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Pro components - require token validation
  if (pathname.startsWith("/r-pro/")) {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required. Please provide a valid token." },
        { status: 401 }
      );
    }

    const isValidToken = await verifyToken(token);

    if (!isValidToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // Free components (/r/) - allow public access
  if (pathname.startsWith("/r/")) {
    return NextResponse.next();
  }

  // Other registry files - continue normally
  return NextResponse.next();
}

async function handleApiRegistryRoutes(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Pro components API - require token validation
  if (pathname.startsWith("/api/registry/pro/")) {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required. Please provide a valid token." },
        { status: 401 }
      );
    }

    const isValidToken = await verifyToken(token);

    if (!isValidToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // Free components API - allow public access
  if (pathname.startsWith("/api/registry/")) {
    return NextResponse.next();
  }

  // Other API registry routes - continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/registry/:path*",
    "/r/:path*",
    "/r-pro/:path*",
    "/api/registry/:path*",
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - r/ and r-pro/ (registry static files - handled separately)
     * - api/registry/ (registry API routes - handled separately)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|r/|r-pro/|api/registry/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
