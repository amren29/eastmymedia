import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Eastmy Media | East Malaysia's Premier OOH Platform",
  description: "Discover and book the best billboard locations across Sabah, Sarawak & Labuan with AI-powered planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
