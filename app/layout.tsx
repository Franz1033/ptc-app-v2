import type { Metadata } from "next";

import { geistMono, geistSans, instrumentSans } from "@/app/fonts";
import { SiteFooter } from "@/app/components/marketplace/site-footer";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pepe Trading Cards | Trading Card Marketplace",
    template: "%s | Pepe Trading Cards",
  },
  description:
    "A Facebook Marketplace-style trading card platform for fixed prices, direct offers, and collector-to-collector deals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSans.variable} h-full antialiased`}
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
