import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], weight: ["500", "700", "900"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Navis | The Visual GPS for AI Chat",
  description: "A premium minimap extension for ChatGPT, Gemini, and Claude. Navigate your thoughts visually.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <SmoothScroll>
          <Navigation />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
