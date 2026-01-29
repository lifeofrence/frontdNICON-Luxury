import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
// import { Cormorant_Garamond } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: 'swap'
});


export const metadata: Metadata = {
  title: "Nicon Luxury",
  description: "Experience world-class hospitality and luxury accommodation at Nicon Luxury.",
  openGraph: {
    title: "Nicon Luxury",
    description: "Experience world-class hospitality and luxury accommodation at Nicon Luxury.",
    url: "https://niconluxury.com",
    siteName: "Nicon Luxury",
    images: [
      {
        url: "/NICON_Luxury.png", // Assuming this is the logo/brand image in public/
        width: 800,
        height: 600,
        alt: "Nicon Luxury",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

import LayoutWrapper from "@/components/layout-wrapper"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={montserrat.className}
      >
        <LayoutWrapper
          navbar={<Navbar />}
          footer={<Footer />}
        >
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
