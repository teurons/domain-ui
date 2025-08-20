import type { Metadata } from "next/types";

export const baseUrl =
  process.env.NODE_ENV === "development" ||
  !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL("http://localhost:3000")
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);

export function createMetadata(override: Metadata): Metadata {
  const ogUrl = `${baseUrl}/api/og`;

  return {
    robots: "index, follow",
    ...override,
    keywords: [
      "Domain UI",
      "Domain-first components",
      "Fintech UI",
      "Trading components",
      "KYC components",
      "Banking UI",
      "Finance components",
      "shadcn",
      "Copy paste components",
      "React components",
      "Tailwind CSS",
      "Industry-specific UI",
      "Business components",
      ...((override.keywords as string[]) || []),
    ],
    authors: [
      {
        name: "@rjv_im",
        url: "https://domain-ui.dev",
      },
    ],
    creator: "@rjv_im",
    openGraph: {
      type: "website",
      locale: "en_US",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: "https://domain-ui.dev",
      siteName: "Domain UI",
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: "Domain UI",
        },
      ],
      ...override.openGraph,
    },
    twitter: {
      site: "@rjv_im",
      card: "summary_large_image",
      creator: "@rjv_im",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: [ogUrl],
      ...override.twitter,
    },
    icons: {
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
      icon: [
        {
          media: "(prefers-color-scheme: light)",
          url: "/assets/light-logo.svg",
          href: "/assets/light-logo.svg",
        },
        {
          media: "(prefers-color-scheme: dark)",
          url: "/assets/dark-logo.svg",
          href: "/assets/dark-logo.svg",
        },
      ],
    },
    manifest: "/site.webmanifest",
    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": "/api/rss.xml",
      },
      ...override.alternates,
    },
  };
}
