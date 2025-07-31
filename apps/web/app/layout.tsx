import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/shadverse/globals.css";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/lib/auth-context";
import AppHeader from "@/components/app-header";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <AuthProvider>
            <AppHeader />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
