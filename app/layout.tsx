import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const pinyon = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://calvin-querida.vercel.app");
const previewImageUrl = new URL("/og-image.jpg?v=4", siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Calvin & Querida — 6 February 2027",
  description: "You are cordially invited to celebrate the wedding of Calvin and Querida.",
  openGraph: {
    title: "Calvin & Querida — 6 February 2027",
    description: "You are cordially invited to celebrate the wedding of Calvin and Querida.",
    url: siteUrl,
    siteName: "Calvin & Querida",
    type: "website",
    images: [
      {
        url: previewImageUrl,
        width: 1200,
        height: 630,
        alt: "Calvin and Querida",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calvin & Querida — 6 February 2027",
    description: "You are cordially invited to celebrate the wedding of Calvin and Querida.",
    images: [previewImageUrl],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${pinyon.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
