/**
 * Get the base URL for the application
 * Handles local development, Vercel preview deployments, and production
 *
 * NOTE: This function is intended for server-side use only (API routes, server components)
 * since it relies on process.env.VERCEL_URL which is not available on the client.
 * For client-side usage, use relative URLs or create a NEXT_PUBLIC_* equivalent.
 */
export function getBaseUrl() {
  // In the browser, use relative URL
  if (typeof window !== "undefined") {
    return "";
  }

  // On Vercel, use the VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // In development, use localhost
  return "http://localhost:3000";
}
