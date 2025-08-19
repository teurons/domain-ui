import { Geist, Geist_Mono } from "next/font/google";

import "./styles/globals.css";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/lib/auth-context";
import { RootProvider } from "fumadocs-ui/provider";
import { baseUrl, createMetadata } from "@workspace/config/metadata";
import { description } from "@workspace/config/layout.config";
import { Analytics } from "@vercel/analytics/next";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = createMetadata({
  title: {
    template: "%s | Domain UI",
    default: "Domain UI",
  },
  description,
  metadataBase: baseUrl,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} overscroll-none bg-background font-sans antialiased`}
      >
        <RootProvider
          search={{
            options: {
              type: "static",
            },
          }}
        >
          <Providers>
            <AuthProvider>{children}</AuthProvider>
          </Providers>
        </RootProvider>
        <Analytics />
        <script
          crossOrigin="anonymous"
          src="//cdn.jsdelivr.net/npm/meta-scan@0.15.0/dist/auto.global.js"
          data-auto-enable="false"
        />
      </body>
    </html>
  );
}
