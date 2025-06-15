import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Logo from "../../public/logo.png";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PolyCode AI - AI-Powered Online Code Editor",
  description:
    "PolyCode AI is an innovative online code editor with AI-powered compilation, offering real-time code execution predictions across multiple programming languages. Experience intelligent syntax highlighting and instant output generation for faster development.",
  openGraph: {
    title: "PolyCode AI - AI-Powered Online Code Editor",
    description:
      "PolyCode AI is an innovative online code editor with AI-powered compilation, offering real-time code execution predictions across multiple programming languages. Experience intelligent syntax highlighting and instant output generation for faster development.",
    url: "https://polycode-ai.vercel.app/",
    siteName: "PolyCode AI",
    images: [
      {
        url: Logo.src,
        width: 800,
        height: 600,
        alt: "PolyCode AI Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PolyCode AI - AI-Powered Online Code Editor",
    description:
      "PolyCode AI is an innovative online code editor with AI-powered compilation, offering real-time code execution predictions across multiple programming languages. Experience intelligent syntax highlighting and instant output generation for faster development.",
    images: [Logo.src],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
