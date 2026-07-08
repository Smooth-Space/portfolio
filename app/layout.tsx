import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Nav } from "@/components/nav/Nav";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/sanity/lib/types";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmoothSpace — Jason Wilkins",
  description: "The design practice of Jason Wilkins. Brand, digital, and generative systems.",
};

// viewport-fit: cover is required for env(safe-area-inset-*) to resolve to
// anything other than 0 — without it, Safari never reports the notch/home
// -indicator safe area at all (see FloatingMenu.module.css, the only
// current consumer).
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await client.fetch<SiteSettings | null>(siteSettingsQuery);
  const navLinks = settings?.navLinks ?? [];
  const socials = settings?.socials ?? [];

  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <Nav navLinks={navLinks} socials={socials} />
        {children}
      </body>
    </html>
  );
}
