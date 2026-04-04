import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lidarota.app"),
  title: {
    default: "LOTA — LiDAR Over the Air",
    template: "%s | LOTA",
  },
  description:
    "Turn your iPhone into a professional spatial capture tool. Stream real-time LiDAR depth, color, and point cloud data via NDI, TCP/UDP, OSC, and PLY. Export COLMAP datasets for Gaussian Splat training.",
  icons: {
    icon: "/LOTA-light.jpg",
    apple: "/LOTA-light.jpg",
  },
  openGraph: {
    title: "LOTA — LiDAR Over the Air",
    description:
      "Turn your iPhone into a professional spatial capture tool. Stream real-time LiDAR data via NDI, TCP/UDP, OSC, and PLY.",
    url: "https://lidarota.app",
    siteName: "LOTA",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/LOTA-dark.jpg",
        width: 512,
        height: 512,
        alt: "LOTA — LiDAR Over the Air",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "LOTA — LiDAR Over the Air",
    description:
      "Turn your iPhone into a professional spatial capture tool. Stream real-time LiDAR data via NDI, TCP/UDP, OSC, and PLY.",
    images: [
      "https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/LOTA-dark.jpg",
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "LOTA — LiDAR Over the Air",
      description:
        "iOS app that transforms iPhones with LiDAR sensors into professional spatial capture tools. Stream depth, color, and point cloud data via NDI, TCP/UDP, OSC, and PLY.",
      operatingSystem: "iOS 17.0+",
      applicationCategory: "MultimediaApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Real-time LiDAR depth streaming",
        "NDI, TCP/UDP, OSC, PLY protocols",
        "Point cloud capture and export",
        "COLMAP-compatible 3D export",
        "Gaussian Splat training data",
        "ARKit body tracking (91 joints)",
        "ARKit face tracking (52 blend shapes)",
        "Metal GPU-accelerated compute",
        "TouchDesigner integration",
        "VoiceOver and Voice Control accessible",
      ],
    },
    {
      "@type": "Organization",
      name: "LOTA",
      url: "https://lidarota.app",
      logo: "https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/LOTA-dark.jpg",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "privacy@lidarota.app",
      },
    },
    {
      "@type": "WebSite",
      name: "LOTA",
      url: "https://lidarota.app",
    },
  ],
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
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
      <Analytics />
    </html>
  );
}
