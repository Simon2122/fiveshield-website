// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // Using Inter font (or choose another)
import "./globals.css"; // Import global styles

// Configure the Inter font
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap' // Optimize font loading
});

// Define metadata for the site (SEO and browser tab info)
export const metadata: Metadata = {
  title: "fiveshield - Advanced DDoS Protection for FiveM & RedM",
  description: "Multi-Layer DDoS protection, low-latency proxy, Cloudflare caching, and dynamic assignment specifically designed for FiveM and RedM servers.",
  // Enhanced metadata
  robots: "index, follow",
  // You can add more metadata here:
  // icons: { icon: '/favicon.ico' }, // Example favicon
  // openGraph: { ... }, // For social sharing previews
  // twitter: { ... },
};

// Define viewport settings including theme color
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: "#1f2937", // Match your dark theme color
};

// Define the Root Layout component
export default function RootLayout({
  children,
}: Readonly<{ // Use Readonly<{ ... }> for children prop type
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/blanc.png" as="image" type="image/png" />
      </head>
      {/* Apply the font class to the body */}
      <body className={`${inter.className} antialiased`}>
        {/* Render the page content passed as children */}
        {children}
      </body>
    </html>
  );
}