// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter font (or choose another)
import "./globals.css"; // Import global styles

// Configure the Inter font
const inter = Inter({ subsets: ["latin"] });

// Define metadata for the site (SEO and browser tab info)
export const metadata: Metadata = {
  title: "fiveshield - Advanced DDoS Protection for FiveM & RedM",
  description: "Multi-Layer DDoS protection, low-latency proxy, Cloudflare caching, and dynamic assignment specifically designed for FiveM and RedM servers.",
  // You can add more metadata here:
  // icons: { icon: '/favicon.ico' }, // Example favicon
  // openGraph: { ... }, // For social sharing previews
  // twitter: { ... },
};

// Define the Root Layout component
export default function RootLayout({
  children,
}: Readonly<{ // Use Readonly<{ ... }> for children prop type
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font class to the body */}
      <body className={`${inter.className} antialiased`}>
        {/* Render the page content passed as children */}
        {children}
      </body>
    </html>
  );
}