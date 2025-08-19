/**
 * Get the base URL for the application
 * Handles local development, Vercel preview deployments, and production
 *
 * NOTE: This function is intended for server-side use only (API routes, server components)
 * since it relies on process.env.VERCEL_URL which is not available on the client.
 * For client-side usage, use relative URLs or create a NEXT_PUBLIC_* equivalent.
 */
export function getBaseUrl() {
  // Check if process is available (server-side) and prioritize Vercel environment
  if (typeof process !== "undefined" && process.env) {
    // On Vercel, prioritize environment-specific URLs
    if (
      process.env.VERCEL_ENV === "production" &&
      process.env.VERCEL_PROJECT_PRODUCTION_URL
    ) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    // Fallback for older Vercel deployments or when VERCEL_ENV is not set
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    // In development, use localhost
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    }
  }

  // In the browser or when process is not available, use localhost
  if (typeof window !== "undefined") {
    return "http://localhost:3000";
  }

  // Final fallback
  return "http://localhost:3000";
}
