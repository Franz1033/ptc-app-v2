import type { Metadata } from "next";
import localFont from "next/font/local";

import { SiteFooter } from "@/app/components/marketplace/site-footer";

import "./globals.css";

const geistSans = localFont({
  src: "../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pepe Trading Cards | Trading Card Marketplace",
    template: "%s | Pepe Trading Cards",
  },
  description:
    "A Facebook Marketplace-style trading card platform for fixed prices, direct offers, and trusted public meetups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <div className="flex min-h-screen flex-col">
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
