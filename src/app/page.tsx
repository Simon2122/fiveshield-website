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
    <div className="min-h-screen bg-gray-900 text-white font-sans">
        {/* --- Navigation Bar --- */}
        <nav className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img
                src="/blanc.png"
                alt="fiveshield Logo"
                className="h-10 w-10 rounded-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/40x40/FFFFFF/1F2937?text=FS";
                  target.alt = "fiveshield Fallback Logo";
                }}
              />
              <span className="text-2xl font-bold text-white">fiveshield</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="hover:text-white transition-all duration-300">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-all duration-300">How It Works</a>
              <a href="#architecture" className="hover:text-white transition-all duration-300">Architecture</a>
              <a href="#about" className="hover:text-white transition-all duration-300">About</a>
              <a href="#contact" className="hover:text-white transition-all duration-300">Contact</a>
            </div>
            <div className="md:hidden">
              <button className="text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* --- Hero Section --- */}
        <section
          id="hero"
          className="relative flex items-center justify-center h-screen bg-gray-900 text-center px-4 overflow-hidden"
        >
          <div className="absolute inset-0 z-0 opacity-10">
            {/* Background visuals */}
          </div>

          <div className="z-10 relative max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-white">
              fiveshield
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Advanced Multi-Layer DDoS Protection for FiveM & RedM Servers. <br />
              Low-latency proxy with dynamic assignment and Cloudflare caching to reduce bandwidth load.
            </p>
            <div className="space-x-4">
              <a
                href="#features"
                className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Learn More
              </a>
              <a
                href="#contact"
                className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </a>
            </div>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <section id="how-it-works" className="py-20 bg-gray-800 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-white">Simple Setup, Powerful Protection</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="flex-1 p-6 bg-white/5 rounded-lg border border-white/20 transform hover:scale-105 hover:border-white/40 transition-all duration-300">
                <div className="bg-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2 text-white">Sign Up</h3>
                <p className="text-gray-400">Choose your plan and register your server details.</p>
              </div>
              {/* Step 2 */}
              <div className="flex-1 p-6 bg-white/5 rounded-lg border border-white/20 transform hover:scale-105 hover:border-white/40 transition-all duration-300">
                <div className="bg-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2 text-white">Configure Origin Server</h3>
                <p className="text-gray-400">Update your server connection settings and integrate the resource to utilize our dynamic proxy system.</p>
              </div>
              {/* Step 3 */}
              <div className="flex-1 p-6 bg-white/5 rounded-lg border border-white/20 transform hover:scale-105 hover:border-white/40 transition-all duration-300">
                <div className="bg-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2 text-white">Stay Protected</h3>
                <p className="text-gray-400">Our multi-layer protection keeps your server online even during attacks.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="architecture" className="py-16 md:py-20 bg-gray-900 px-4 overflow-hidden">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 md:mb-12 text-white">Protection Architecture</h2>
            <p className="text-lg md:text-xl text-gray-400 mb-12 md:mb-16 max-w-3xl mx-auto">
              Our multi-layer defense system combines intelligent Layer 7 filtering, dynamic proxy allocation, and a distributed proxy network. Each proxy enforces Layer 4 protection, allowing only verified player IPs to connect, ensuring maximum security for your FiveM/RedM server.
            </p>

            {/* Architecture Diagram Wrapper */}
            <div className="relative max-w-6xl mx-auto pb-20">
              {/* Diagram elements container */}
              <div className="flex flex-col items-center w-full">

                {/* --- Main Horizontal Flow Container --- */}
                <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 lg:gap-4 relative">

                  {/* Stage 1: Layer 7 Protection */}
                  <div className="flex flex-col items-center relative">
                    {/* Label placed above the box */}
                    <div className="text-white-400 font-medium mb-2">Layer 7 Protection</div>
                    {/* Box without overlapping label */}
                    <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center justify-center bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <span className="text-sm text-purple-400">Application Filtering</span>
                      <span className="text-xs text-purple-300 mt-1">Blocks bad requests</span>
                    </div>
                    
                    {/* Vertical Arrow (Mobile Only) - Changed to white */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="block lg:hidden h-10 w-10 text-white mt-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>

                  {/* Horizontal Arrow (Large Screens Only) - Changed to white */}
                  <div className="hidden lg:flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 xl:h-12 xl:w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  {/* Stage 2: Dynamic Assignment */}
                  <div className="flex flex-col items-center">
                    {/* Label placed above the box */}
                    <div className="text-white-400 font-medium mb-2">Dynamic Assignment</div>
                    {/* Box without overlapping label */}
                    <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center justify-center bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                      <span className="text-sm text-blue-400">API Proxy Selection</span>
                      <span className="text-xs text-blue-300 mt-1">Optimized routing</span>
                    </div>
                    
                    {/* Vertical Arrow (Mobile Only) - Changed to white */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="block lg:hidden h-10 w-10 text-white mt-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>

                  {/* Horizontal Arrow (Large Screens Only) - Changed to white */}
                  <div className="hidden lg:flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 xl:h-12 xl:w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  {/* Stage 3: Traffic Distribution - Removed containing box */}
                  <div className="flex flex-col items-center">
                    {/* Distribution Proxies Label */}
                    <div className="relative w-full mb-6">
                      <div className="text-white-400 text-center font-medium">Distribution Proxies</div>
                    </div>
                    {/* Proxies Grid - Directly without container box */}
                    <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-28 md:w-32 h-24 flex flex-col items-center justify-center bg-green-500/20 border border-green-500/40 rounded-lg text-center p-1 md:p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                          <span className="text-xs md:text-sm mt-1 text-green-400">Proxy</span>
                          <span className="text-xs text-green-300">L4 Defense</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Vertical Arrow (Mobile Only) - Changed to white */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="block lg:hidden h-10 w-10 text-white mt-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>

                  {/* Horizontal Arrow (Large Screens Only) - Changed to white */}
                  <div className="hidden lg:flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 xl:h-12 xl:w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  {/* Stage 4: FiveM Server */}
                  <div className="flex flex-col items-center">
                  <div className="text-white font-medium mb-2">Your FiveM Server</div>
                    <div className="w-full max-w-xs sm:max-w-sm h-32 flex flex-col items-center justify-center bg-blue-500/20 border border-blue-500/40 rounded-lg text-center p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                      </svg>
                      <span className="text-base md:text-lg font-medium mt-2 text-blue-400">Origin Server</span>
                      <span className="text-xs text-blue-300">Protected</span>
                    </div>
                  </div>

                </div> {/* End Main Flow Container */}

              </div> {/* End diagram elements container */}
            </div> {/* End wrapper */}

            {/* Architecture Explanation */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
              <div className="p-6 bg-white/5 rounded-lg border border-white/20 transform hover:scale-105 hover:border-purple-500/40 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-2 text-purple-400">Layer 7 Protection</h3>
                <p className="text-gray-400">Inspects application-level traffic to filter sophisticated bots and exploits, verifying legitimate player connections.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-lg border border-white/20 transform hover:scale-105 hover:border-blue-500/40 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-2 text-blue-400">Dynamic Assignment</h3>
                <p className="text-gray-400">Verified players are intelligently routed via an API to the best available proxy server based on factors like location and current load.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-lg border border-white/20 transform hover:scale-105 hover:border-green-500/40 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-2 text-green-400">Distributed Proxies</h3>
                <p className="text-gray-400">Our network of geographically diverse proxy servers absorbs and mitigates high-volume Layer 4 (network-level) DDoS attacks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Caching System Section --- */}
        <section id="caching" className="py-16 md:py-20 bg-gray-800 px-4 overflow-hidden">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 md:mb-12 text-white">Optimized Content Delivery</h2>
            <p className="text-lg md:text-xl text-gray-400 mb-12 md:mb-16 max-w-3xl mx-auto">
              Our advanced caching system significantly reduces download times and server load by leveraging Cloudflare's global CDN network.
            </p>

            {/* Caching Architecture Diagram */}
            <div className="relative max-w-6xl mx-auto pb-20">
              <div className="flex flex-col items-center w-full">

                {/* --- Main Horizontal Flow Container --- */}
                <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 lg:gap-4 relative">

                  {/* FiveM Player */}
                  <div className="flex flex-col items-center relative">
                    <div className="text-white font-medium mb-2">FiveM Player</div>
                    <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center justify-center bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm text-green-400">Client</span>
                      <span className="text-xs text-green-300 mt-1">Requesting Resources</span>
                    </div>
                    
                    {/* Vertical Arrow (Mobile Only) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="block lg:hidden h-10 w-10 text-white mt-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>

                  {/* Horizontal Arrow (Large Screens Only) */}
                  <div className="hidden lg:flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 xl:h-12 xl:w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  {/* Cloudflare CDN */}
                  <div className="flex flex-col items-center">
                    <div className="text-white font-medium mb-2">Cloudflare CDN</div>
                    <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center justify-center bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <span className="text-sm text-orange-400">Global Network</span>
                      <span className="text-xs text-orange-300 mt-1">Fast Content Delivery</span>
                    </div>
                    
                    {/* Vertical Arrow (Mobile Only) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="block lg:hidden h-10 w-10 text-white mt-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>

                  {/* Horizontal Arrow (Large Screens Only) */}
                  <div className="hidden lg:flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 xl:h-12 xl:w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  {/* FiveM Server */}
                  <div className="flex flex-col items-center">
                    <div className="text-white font-medium mb-2">Your FiveM Server</div>
                    <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center justify-center bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                      </svg>
                      <span className="text-sm text-blue-400">Origin Server</span>
                      <span className="text-xs text-blue-300 mt-1">Source of content</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Caching System Explanation */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16">
              <div className="p-6 bg-white/5 rounded-lg border border-white/20 transform hover:scale-105 hover:border-orange-500/40 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-2 text-orange-400">Cloudflare CDN</h3>
                <p className="text-gray-400">Players connect through Cloudflare's global network, which serves cached resources instantly from its closest edge location for ultra-fast downloads worldwide.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-lg border border-white/20 transform hover:scale-105 hover:border-blue-500/40 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-2 text-blue-400">Reduced Server Load</h3>
                <p className="text-gray-400">With Cloudflare's powerful caching capabilities, your FiveM server experiences dramatically reduced bandwidth usage, allowing it to focus on providing a smooth gameplay experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- About Section --- */}
        <section id="about" className="py-20 bg-gray-900 px-4">
          <div className="container mx-auto max-w-3xl text-center p-6 bg-white/5 rounded-lg border border-white/20">
            <h2 className="text-4xl font-bold mb-8 text-white">About FiveShield</h2>
            <p className="text-lg text-gray-400 mb-4">
              FiveShield is an advanced DDoS mitigation solution built specifically for FiveM/RedM servers. Our infrastructure is designed to protect against Layer 7 and Layer 4 attacks while ensuring seamless gameplay.
            </p>
            <p className="text-lg text-gray-400 mb-4">
              All player connections pass through an intelligent HTTP proxy that filters malicious traffic and validates legitimate players. Once verified, players are dynamically assigned to a dedicated proxy, distributing traffic efficiently across multiple nodes.
            </p>
          </div>
        </section>


        {/* --- Contact/Call to Action Section --- */}
        <section id="contact" className="py-20 bg-gray-800 text-center px-4">
          <div className="container mx-auto max-w-2xl p-8 bg-white/5 rounded-lg border border-white/20">
            <h2 className="text-4xl font-bold mb-6 text-white">Ready to Secure Your Server?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Get started with fiveshield today and protect your community with our advanced multi-layer DDoS protection.
            </p>
            <a
              href="#"
              className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Protect My Server Now
            </a>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="py-8 bg-gray-900 text-center text-gray-400">
          <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} fiveshield. All rights reserved.</p>
          </div>
        </footer>
    </div>
  ); // End of return statement
} // End of HomePage component
