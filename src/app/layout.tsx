import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { site } from "@/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: photo pose ideas for everyone`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: { title: site.name, description: site.description, type: "website", images: ["/og.png"] },
  twitter: { card: "summary_large_image" },
  appleWebApp: { capable: true, title: site.name, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#17122B", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <header className="top">
          <Link href="/" className="logo" aria-label={`${site.name} home`}>
            Pose<span>Deck</span>
          </Link>
          <nav aria-label="Main">
            <Link href="/search">Search</Link>
            <Link href="/saved">Saved</Link>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="foot">
          <p>{site.name}. Illustrated pose ideas, free to use.</p>
        </footer>
        {site.ads.client && (
          <Script async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.ads.client}`} />
        )}
      </body>
    </html>
  );
}
