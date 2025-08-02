import { Geist, Geist_Mono } from "next/font/google";

import "./styles/globals.css";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/lib/auth-context";
import { RootProvider } from "fumadocs-ui/provider";
import { baseUrl, createMetadata } from "@workspace/config/metadata";
import { description } from "@workspace/config/layout.config";

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
    template: "%s | SaaS Foundations",
    default: "SaaS Foundations",
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
        className={`${fontSans.variable} ${fontMono.variable} bg-background overscroll-none font-sans antialiased`}
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
      </body>
    </html>
  );
}
