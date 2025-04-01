// Add this line at the very top for App Router compatibility with hooks
'use client';

import React, { useState, useEffect } from 'react';
// Import Lucide icons if needed, e.g.:
// import { ShieldCheck, Zap, Server } from 'lucide-react';

// Main component for the landing page (e.g., src/app/page.tsx)
export default function HomePage() {
  // State for potential animations or interactions (optional)
  const [scrollY, setScrollY] = useState(0);

  // Effect to track scroll position (optional, for parallax/animations)
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    // Add scroll listener when component mounts
    window.addEventListener('scroll', handleScroll);
    // Clean up listener when component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    // Main container with dark theme using Tailwind CSS classes
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* --- Navigation Bar --- */}
      {/* Sticky positioning keeps it at the top during scroll */}
      {/* Background with opacity and backdrop blur for a modern effect */}
      <nav className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Site Name */}
          <div className="flex items-center space-x-2">
            <img
              src="/blanc.png" // Path relative to the 'public' folder in Next.js
              alt="fiveshield Logo"
              className="h-10 w-10 rounded-md" // Tailwind classes for styling
              onError={(e) => {
                // Fallback placeholder if the image fails to load
                const target = e.target as HTMLImageElement; // Type assertion for safety
                target.onerror = null; // Prevent infinite loop if placeholder also fails
                target.src = "https://placehold.co/40x40/FFFFFF/1F2937?text=FS";
                target.alt = "fiveshield Fallback Logo";
              }}
            />
            <span className="text-2xl font-bold text-purple-400">fiveshield</span>
          </div>
          {/* Desktop Navigation Links */}
          {/* Hidden on small screens (md:flex) */}
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="hover:text-purple-400 transition duration-300">Features</a>
            <a href="#how-it-works" className="hover:text-purple-400 transition duration-300">How It Works</a>
            <a href="#about" className="hover:text-purple-400 transition duration-300">About</a>
            <a href="#contact" className="hover:text-purple-400 transition duration-300">Contact</a>
          </div>
          {/* Mobile Menu Button (Placeholder) */}
          {/* Shown only on small screens (md:hidden) */}
          {/* Needs JavaScript/State to toggle a mobile menu */}
          <div className="md:hidden">
            <button className="text-white focus:outline-none">
              {/* Hamburger icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      {/* Full screen height (h-screen), flex layout to center content */}
      {/* Gradient background */}
      <section
        id="hero"
        className="relative flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-purple-900 text-center px-4 overflow-hidden"
      >
        {/* Optional: Background elements container */}
        <div className="absolute inset-0 z-0 opacity-10">
          {/* Add decorative background visuals here if desired */}
        </div>

        {/* Content container */}
        <div className="z-10 relative max-w-4xl">
          {/* Logo displayed prominently */}
           <img
              src="/blanc.png" // Path relative to 'public' folder
              alt="fiveshield Logo"
              className="h-24 w-24 mx-auto mb-6 rounded-lg shadow-xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://placehold.co/96x96/FFFFFF/1F2937?text=FS";
                target.alt = "fiveshield Fallback Logo";
              }}
            />
           {/* Main Headline */}
           {/* Gradient text effect */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            fiveshield
          </h1>
          {/* Sub-headline/Description */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Ultimate DDoS Protection for FiveM & RedM Servers. <br />
            Low-latency proxy caching for seamless gameplay.
          </p>
          {/* Call to Action Buttons */}
          <div className="space-x-4">
            <a
              href="#features"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Learn More
            </a>
            <a
              href="#contact"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="py-20 bg-gray-800 px-4">
  <div className="container mx-auto text-center">
    <h2 className="text-4xl font-bold mb-12 text-white">Why Choose fiveshield?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Feature Card 1 */}
      <div className="flex flex-col items-center p-6 bg-white/5 rounded-lg border border-white/20 hover:border-white/40 transition-colors">
        <span className="text-4xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-life-buoy">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m4.93 4.93 4.24 4.24"></path>
            <path d="m14.83 9.17 4.24-4.24"></path>
            <path d="m14.83 14.83 4.24 4.24"></path>
            <path d="m9.17 14.83-4.24 4.24"></path>
            <circle cx="12" cy="12" r="4"></circle>
          </svg>
        </span>
        <div className="tracking-tight inline text-white text-2xl font-black mb-2">Advanced DDoS Mitigation</div>
        <p className="text-gray-400 text-center font-medium">Multi-layered protection against complex attacks, keeping your server online 24/7.</p>
      </div>
      {/* Feature Card 2 */}
      <div className="flex flex-col items-center p-6 bg-white/5 rounded-lg border border-white/20 hover:border-white/40 transition-colors">
        <span className="text-4xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </span>
        <div className="tracking-tight inline text-white text-2xl font-black mb-2">Low Latency Proxy</div>
        <p className="text-gray-400 text-center font-medium">Optimized routing and caching ensures minimal ping increase for players.</p>
      </div>
      {/* Feature Card 3 */}
      <div className="flex flex-col items-center p-6 bg-white/5 rounded-lg border border-white/20 hover:border-white/40 transition-colors">
        <span className="text-4xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </span>
        <div className="tracking-tight inline text-white text-2xl font-black mb-2">FiveM & RedM Optimized</div>
        <p className="text-gray-400 text-center font-medium">Specifically designed for the needs and traffic patterns of FiveM and RedM servers.</p>
      </div>
    </div>
  </div>
</section>

      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="py-20 bg-gray-900 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-purple-400">Simple Setup, Powerful Protection</h2>
          {/* Flex layout for steps, responsive direction */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex-1 text-center md:text-left">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto md:mx-0 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-400">Choose your plan and register your server details.</p>
            </div>
            {/* Arrow Separator (responsive visibility and orientation) */}
            <div className="text-purple-400 text-4xl hidden md:block">&rarr;</div>
             <div className="text-purple-400 text-4xl block md:hidden transform rotate-90">&rarr;</div>
            {/* Step 2 */}
             <div className="flex-1 text-center md:text-left">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto md:mx-0 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Configure Proxy</h3>
              <p className="text-gray-400">Update your server connection details to point to our secure proxy address.</p>
            </div>
             {/* Arrow Separator */}
            <div className="text-purple-400 text-4xl hidden md:block">&rarr;</div>
            <div className="text-purple-400 text-4xl block md:hidden transform rotate-90">&rarr;</div>
            {/* Step 3 */}
             <div className="flex-1 text-center md:text-left">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto md:mx-0 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Stay Protected</h3>
              <p className="text-gray-400">Enjoy peace of mind knowing your server is shielded from attacks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-20 bg-gray-800 px-4">
        <div className="container mx-auto max-w-3xl text-center">
           <h2 className="text-4xl font-bold mb-8 text-purple-400">About fiveshield</h2>
           <p className="text-lg text-gray-400 mb-4">
             fiveshield was founded by passionate gamers and network engineers who understand the frustration of DDoS attacks targeting FiveM and RedM communities. Our mission is to provide robust, reliable, and low-latency protection so you can focus on providing the best roleplaying experience.
           </p>
           <p className="text-lg text-gray-400">
             We leverage cutting-edge proxy technology and intelligent caching to filter malicious traffic without impacting legitimate player connections.
           </p>
        </div>
      </section>

       {/* --- Contact/Call to Action Section --- */}
      <section id="contact" className="py-20 bg-gradient-to-t from-gray-900 via-gray-800 to-purple-900 text-center px-4">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Server?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get started with fiveshield today and protect your community from disruptive DDoS attacks.
          </p>
          {/* Main Call to Action Button */}
          <a
            href="#" // Replace with your actual sign-up or contact page link
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg"
          >
            Protect My Server Now
          </a>
           {/* Optional: Placeholder for contact form or details */}
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-8 bg-gray-900 text-center text-gray-500">
        <div className="container mx-auto">
          {/* Dynamic year in copyright */}
          <p>&copy; {new Date().getFullYear()} fiveshield. All rights reserved.</p>
          {/* Add social media links or other footer info here if needed */}
        </div>
      </footer>

    </div> // End of main container div
  ); // End of return statement
} // End of HomePage component
