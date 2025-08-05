"use client";

import RegistryCodeBlock from "./registry-code-block";
import type { CodeBlockProps as BaseCodeBlockProps } from "fumadocs-ui/components/codeblock";

interface DynamicRegistryCodeBlockProps {
  name: string;
  registry?: "free" | "pro";
  filePath?: string;
  fileType?: string;
  wrapper?: BaseCodeBlockProps;
}

function getRegistryBaseUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Browser environment - check if we're in development
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      // Development environment - registry is always on Next.js port
      return `${protocol}//localhost:3000`;
    }

    // For deployed versions, use current origin (registry is on same domain)
    return window.location.origin;
  }

  // Server-side: Check for Vercel deployment first
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Development fallback
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Production fallback
  return "https://domain-ui.dev";
}

export default function DynamicRegistryCodeBlock({
  name,
  registry = "free",
  filePath,
  fileType,
  wrapper,
}: DynamicRegistryCodeBlockProps) {
  const baseUrl = getRegistryBaseUrl();
  const registryPath = registry === "pro" ? "/r-pro" : "/r";
  const url = `${baseUrl}${registryPath}/${name}.json`;

  return (
    <RegistryCodeBlock
      url={url}
      filePath={filePath}
      fileType={fileType}
      wrapper={wrapper}
    />
  );
}
