// src/app/page.tsx
'use client'; // Must be at the top

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ShieldCheck, Zap, Server, Cloud, Cpu, Users, ChevronDown, ArrowRight,
  Menu, X, CheckCircle2, ExternalLink, Settings, Layers, Route
} from 'lucide-react';

// Lazy load the 3D Globe component
const GlobeVisualization = lazy(() => import('./components/GlobeVisualization'));

// Animation Variants for Framer Motion
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on link click
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Handle image loading errors (optional but good practice)
   const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
     const target = e.target as HTMLImageElement;
     target.onerror = null; // prevent infinite loop
     target.src = `https://placehold.co/${target.width || 40}x${target.height || 40}/FFFFFF/1F2937?text=FS`; // Fallback placeholder
     target.alt = "fiveshield Fallback Logo";
   };
    const handleOvhImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
     const target = e.target as HTMLImageElement;
     target.onerror = null; // prevent infinite loop
     target.style.display = 'none'; // Hide if OVH image fails
   };

  return (
    // Main container with background gradient
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/40 text-white font-sans overflow-x-hidden">

      {/* --- Navigation Bar --- */}
      <nav className="sticky top-0 z-50 bg-gray-900/70 backdrop-blur-lg p-4 border-b border-white/10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2 group flex-shrink-0">
            <img
              src="/blanc.png" // Path in public folder
              alt="fiveshield Logo"
              className="h-10 w-10 rounded-md transition-transform duration-300 group-hover:scale-110"
              width={40} height={40}
              onError={handleImageError}
            />
            <span className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-indigo-400">
              fiveshield
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 flex-grow justify-center items-center text-gray-300 text-sm lg:text-base">
            <a href="#installation" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
              Installation
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
             <a href="#architecture" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
               Architecture
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
             <a href="#caching" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
               Caching
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#about" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
              About
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#contact" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
              Contact
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* Desktop Right Side (Discord + Panel) */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <a
              href="https://discord.gg/zucpnTMzHt"
              target="_blank"
              rel="noopener noreferrer"
              className="group text-gray-400 hover:text-indigo-400 transition-colors duration-300 p-1"
              aria-label="Join Discord"
            >
               {/* Simple Discord Icon SVG */}
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" className="h-5 w-5 fill-current transition-transform duration-300 group-hover:scale-110"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
            </a>
            <a
              href="https://panel.fiveshield.co" // Update link if panel is live
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-1.5 px-4 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 text-sm inline-flex items-center"
            >
              Panel (Soon) <ExternalLink className="inline-block h-3.5 w-3.5 ml-1.5" />
            </a>
          </div>

          {/* Mobile Menu Button & Discord Icon */}
          <div className="md:hidden flex items-center space-x-3">
             <a
              href="https://discord.gg/zucpnTMzHt"
              target="_blank"
              rel="noopener noreferrer"
              className="group text-gray-400 hover:text-indigo-400 transition-colors duration-300 p-1"
              aria-label="Join Discord"
            >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" className="h-5 w-5 fill-current transition-transform duration-300 group-hover:scale-110"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-1"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial={false}
          animate={mobileMenuOpen ? "open" : "closed"}
          variants={{
            open: { opacity: 1, height: 'auto', marginTop: '1rem' },
            closed: { opacity: 0, height: 0, marginTop: '0rem' },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`md:hidden overflow-hidden`}
        >
          <div className="flex flex-col space-y-2 py-3 pb-4 px-4 bg-gray-800/95 rounded-lg mt-2 border border-white/10 shadow-lg">
            <a href="#installation" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">Installation</a>
            <a href="#architecture" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">Architecture</a>
            <a href="#caching" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">Caching</a>
            <a href="#about" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">About</a>
            <a href="#contact" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">Contact</a>
            <a
              href="https://panel.fiveshield.co" // Update link if panel is live
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleNavLinkClick}
              className="mt-3 block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              Panel (Soon) <ExternalLink className="inline-block h-4 w-4 ml-1" />
            </a>
          </div>
        </motion.div>
      </nav>

      {/* --- Hero Section --- */}
      <section
        id="hero"
        className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900/30 to-gray-900 text-center px-4 overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20"
      >
        {/* Background Elements Container */}
        <div className="absolute inset-0 z-0">
          {/* Globe Visualization */}
          <Suspense fallback={<div className="absolute inset-0 bg-gray-900/5" />}>
            <GlobeVisualization />
          </Suspense>

          {/* Optional subtle glows (can be removed if globe is enough) */}
          {/* <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-purple-600/5 rounded-full filter blur-3xl animate-pulse opacity-50"></div> */}
          {/* <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-indigo-600/5 rounded-full filter blur-3xl animate-pulse animation-delay-400 opacity-50"></div> */}
        </div>

        {/* Hero Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="z-10 relative max-w-4xl" // Ensure content is above background
        >
          <motion.h1
            variants={fadeIn}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-5 md:mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-indigo-400"
          >
            fiveshield
          </motion.h1>
          <motion.p
            variants={fadeIn}
            className="text-lg sm:text-xl md:text-2xl text-gray-300/90 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Advanced Multi-Layer DDoS Protection for FiveM & RedM Servers.
            Low-latency proxy with dynamic assignment and Cloudflare caching.
          </motion.p>
          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <a
              href="#installation"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30"
            >
              Learn More <ChevronDown className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* --- How It Works Section --- */}
      <section id="installation" className="py-20 md:py-28 bg-gray-900 px-4">
        <div className="container mx-auto text-center">
          <motion.h2
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-16 text-white"
          >
            Simple Setup, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Powerful Protection</span>
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {/* Step 1 */}
            <motion.div
              variants={fadeIn}
              className="group p-6 md:p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/40 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/20 flex flex-col items-center"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Sign Up</h3>
              <p className="text-gray-400 text-sm md:text-base">Choose your plan and register your server details quickly.</p>
            </motion.div>
            {/* Step 2 */}
            <motion.div
              variants={fadeIn}
              className="group p-6 md:p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/40 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/20 flex flex-col items-center"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Settings size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Configure</h3>
              <p className="text-gray-400 text-sm md:text-base">Update settings and integrate our resource for dynamic protection.</p>
            </motion.div>
            {/* Step 3 */}
            <motion.div
              variants={fadeIn}
              className="group p-6 md:p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/40 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/20 flex flex-col items-center"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Stay Protected</h3>
              <p className="text-gray-400 text-sm md:text-base">Our multi-layer system keeps your server online 24/7.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Protection Architecture Section --- */}
      <section id="architecture" className="py-20 md:py-28 bg-gradient-to-b from-gray-900 to-gray-800/70 px-4 overflow-hidden">
            <div className="container mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-6 text-white">Protection Architecture
                </motion.h2>
                 <motion.p
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-lg md:text-xl text-gray-400 mb-16 md:mb-20 max-w-3xl mx-auto leading-relaxed">
                    Our multi-layer defense combines intelligent L7 filtering, dynamic proxy allocation, and distributed L4 mitigation for maximum security.
                </motion.p>

                {/* Architecture Diagram Wrapper */}
                <motion.div
                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
                  className="relative max-w-6xl mx-auto pb-10"
                >
                    <div className="flex flex-col items-center w-full">
                        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center w-full gap-6 lg:gap-4 relative">
                            {/* Stage 1: Layer 7 Protection */}
                            <motion.div variants={fadeIn} className="flex flex-col items-center relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
                                <div className="text-indigo-400 font-semibold mb-3 text-xs tracking-widest">LAYER 7</div>
                                <div className="w-full h-full flex flex-col items-center justify-center bg-purple-600/10 border border-purple-500/30 rounded-lg px-4 py-6 shadow-lg min-h-[180px]">
                                    <Layers className="h-10 w-10 text-purple-400 mb-3" />
                                    <span className="text-base font-semibold text-purple-300">Application Filtering</span>
                                    <span className="text-xs text-purple-400/80 mt-1 text-center px-2">Intelligent Bot & Exploit Blocking</span>
                                </div>
                                <ArrowRight className="block lg:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                            </motion.div>
                            {/* Arrow (Large Screens) */}
                            <div className="hidden lg:flex items-center pt-10"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                            {/* Stage 2: Dynamic Assignment */}
                             <motion.div variants={fadeIn} className="flex flex-col items-center relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
                                <div className="text-indigo-400 font-semibold mb-3 text-xs tracking-widest">ASSIGNMENT</div>
                                <div className="w-full h-full flex flex-col items-center justify-center bg-blue-600/10 border border-blue-500/30 rounded-lg px-4 py-6 shadow-lg min-h-[180px]">
                                    <Route className="h-10 w-10 text-blue-400 mb-3" />
                                    <span className="text-base font-semibold text-blue-300">Dynamic API Routing</span>
                                    <span className="text-xs text-blue-400/80 mt-1 text-center px-2">Optimized Proxy Selection</span>
                                </div>
                                <ArrowRight className="block lg:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                            </motion.div>
                             {/* Arrow (Large Screens) */}
                            <div className="hidden lg:flex items-center pt-10"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                            {/* Stage 3: Distribution Proxies (Layer 4) */}
                            <motion.div variants={fadeIn} className="flex flex-col items-center relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
                                <div className="text-indigo-400 font-semibold mb-3 text-xs tracking-widest">LAYER 4</div>
                                <div className="w-full h-full flex flex-col items-center justify-center bg-green-600/10 border border-green-500/30 rounded-lg px-4 py-6 shadow-lg min-h-[180px]">
                                     <Server className="h-10 w-10 text-green-400 mb-3" />
                                    <span className="text-base font-semibold text-green-300">Distributed Proxies</span>
                                    <span className="text-xs text-green-400/80 mt-1 text-center px-2">Network Attack Mitigation</span>
                                </div>
                                 <ArrowRight className="block lg:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                            </motion.div>
                            {/* Arrow (Large Screens) */}
                            <div className="hidden lg:flex items-center pt-10"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                            {/* Stage 4: Your Server */}
                             <motion.div variants={fadeIn} className="flex flex-col items-center relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
                                <div className="text-indigo-400 font-semibold mb-3 text-xs tracking-widest">ORIGIN</div>
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-600/10 border border-gray-500/30 rounded-lg px-4 py-6 shadow-lg min-h-[180px]">
                                    <Cpu className="h-10 w-10 text-gray-400 mb-3" />
                                    <span className="text-base font-semibold text-gray-300">Your Server</span>
                                    <span className="text-xs text-gray-400/80 mt-1 text-center px-2">Protected & Online</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Architecture Explanation Cards */}
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16 md:mt-20">
                    <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-purple-500/40 transition-colors duration-300 transform hover:scale-[1.03] hover:shadow-lg">
                        <h3 className="text-xl font-semibold mb-2 text-purple-400 flex items-center"><Layers size={20} className="mr-2"/>Layer 7 Protection</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Inspects application traffic to filter bots and exploits, verifying legitimate players.</p>
                    </motion.div>
                    <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-blue-500/40 transition-colors duration-300 transform hover:scale-[1.03] hover:shadow-lg">
                        <h3 className="text-xl font-semibold mb-2 text-blue-400 flex items-center"><Route size={20} className="mr-2"/>Dynamic Assignment</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Verified players are routed via API to the optimal proxy based on location and load.</p>
                    </motion.div>
                    <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-green-500/40 transition-colors duration-300 transform hover:scale-[1.03] hover:shadow-lg">
                        <h3 className="text-xl font-semibold mb-2 text-green-400 flex items-center"><Server size={20} className="mr-2"/>Distributed L4 Proxies</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Our proxy network absorbs and mitigates high-volume network-level DDoS attacks.</p>
                    </motion.div>
                </motion.div>
            </div>
        </section>

      {/* --- Caching System Section --- */}
       <section id="caching" className="py-20 md:py-28 bg-gray-900 px-4 overflow-hidden">
           <div className="container mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-6 text-white">Optimized Content Delivery
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-lg md:text-xl text-gray-400 mb-16 md:mb-20 max-w-3xl mx-auto leading-relaxed">
                    Leveraging Cloudflare's global CDN significantly reduces download times and your server's bandwidth load.
                </motion.p>

                {/* Caching Diagram */}
                 <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
                    className="relative max-w-5xl mx-auto pb-10">
                    <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-6 md:gap-8">
                         {/* Player */}
                        <motion.div variants={fadeIn} className="flex flex-col items-center w-full max-w-xs">
                             <div className="text-green-400 font-semibold mb-3 text-xs tracking-widest">PLAYER</div>
                             <div className="w-full flex flex-col items-center justify-center bg-green-600/10 border border-green-500/30 rounded-lg px-4 py-6 shadow-lg text-center min-h-[180px]">
                                <Users className="h-10 w-10 text-green-400 mb-3"/>
                                <span className="text-base font-semibold text-green-300">Client Request</span>
                                <span className="text-xs text-green-400/80 mt-1">Downloads Resources</span>
                             </div>
                             <ArrowRight className="block md:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                         </motion.div>
                         {/* Arrow */}
                         <div className="hidden md:flex items-center"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                         {/* Cloudflare */}
                         <motion.div variants={fadeIn} className="flex flex-col items-center w-full max-w-xs">
                             <div className="text-orange-400 font-semibold mb-3 text-xs tracking-widest">CLOUDFLARE</div>
                             <div className="w-full flex flex-col items-center justify-center bg-orange-600/10 border border-orange-500/30 rounded-lg px-4 py-6 shadow-lg text-center min-h-[180px]">
                                <Cloud className="h-10 w-10 text-orange-400 mb-3"/>
                                <span className="text-base font-semibold text-orange-300">Global CDN</span>
                                <span className="text-xs text-orange-400/80 mt-1">Serves Cached Content</span>
                             </div>
                             <ArrowRight className="block md:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                         </motion.div>
                         {/* Arrow */}
                          <div className="hidden md:flex items-center"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                         {/* Origin Server */}
                          <motion.div variants={fadeIn} className="flex flex-col items-center w-full max-w-xs">
                             <div className="text-blue-400 font-semibold mb-3 text-xs tracking-widest">YOUR SERVER</div>
                             <div className="w-full flex flex-col items-center justify-center bg-blue-600/10 border border-blue-500/30 rounded-lg px-4 py-6 shadow-lg text-center min-h-[180px]">
                                <Cpu className="h-10 w-10 text-blue-400 mb-3"/>
                                <span className="text-base font-semibold text-blue-300">Origin Server</span>
                                <span className="text-xs text-blue-400/80 mt-1">Reduced Bandwidth Load</span>
                             </div>
                         </motion.div>
                    </div>
                 </motion.div>

                {/* Caching Explanation Cards */}
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
                    className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16 md:mt-20">
                    <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-orange-500/40 transition-colors duration-300 transform hover:scale-[1.03] hover:shadow-lg">
                        <h3 className="text-xl font-semibold mb-2 text-orange-400 flex items-center"><Cloud size={20} className="mr-2"/>Cloudflare CDN</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Players download from Cloudflare's closest edge location for ultra-fast speeds worldwide.</p>
                    </motion.div>
                     <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-blue-500/40 transition-colors duration-300 transform hover:scale-[1.03] hover:shadow-lg">
                        <h3 className="text-xl font-semibold mb-2 text-blue-400 flex items-center"><Zap size={20} className="mr-2"/>Reduced Server Load</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">Caching dramatically reduces your server's bandwidth usage, freeing up resources for gameplay.</p>
                    </motion.div>
                </motion.div>
           </div>
        </section>

      {/* --- About Section --- */}
       <section id="about" className="py-20 md:py-28 bg-gradient-to-b from-gray-800/70 to-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}
                className="container mx-auto max-w-4xl text-center p-8 md:p-12 bg-gray-800/60 rounded-xl border border-white/10 shadow-lg relative overflow-hidden backdrop-blur-sm"
            >
                 {/* Subtle background glows */}
                 <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-600/10 rounded-full filter blur-3xl opacity-50 z-[-1]"></div>
                 <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full filter blur-3xl opacity-50 z-[-1]"></div>

                <div className="relative z-10">
                    <h2 className="text-4xl font-bold mb-8 text-white">About FiveShield</h2>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                        FiveShield provides specialized DDoS mitigation for FiveM/RedM. Our intelligent multi-layer infrastructure filters malicious traffic while ensuring seamless, low-latency gameplay for legitimate players.
                    </p>

                    {/* OVH Recommendation */}
                    <div className="mt-10 p-6 bg-gradient-to-r from-white/5 to-white/10 rounded-lg border border-white/15 transform transition-all duration-300 hover:shadow-lg hover:border-white/25">
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center justify-center"><ShieldCheck size={24} className="mr-2 text-green-400"/>Recommended Infrastructure</h3>
                        <img
                            src="/ovhcloud.png" // Path in public folder
                            alt="OVH Cloud Logo"
                            className="h-12 mx-auto mb-5 opacity-80 hover:opacity-100 transition-opacity duration-300"
                            width={180} // Provide estimate for layout shift prevention
                            height={48}
                            onError={handleOvhImageError}
                        />
                        <p className="text-base text-gray-300">
                            For optimal resilience, we <strong className="text-white">highly recommend OVHcloud</strong> as your origin server provider. Our system integrates tightly with OVH's network for enhanced protection against complex attacks.
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>

      {/* --- Contact/Call to Action Section --- */}
       <section id="contact" className="py-20 md:py-32 px-4 relative">
          {/* Gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-indigo-900/40 to-gray-900 opacity-95 z-0"></div>

          <div className="container mx-auto max-w-4xl relative z-10">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">Ready to Secure Your Server?</h2>
              <div className="w-28 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
            </motion.div>

            {/* Main CTA card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: 'easeOut' }}
              className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 shadow-xl p-8 md:p-12 transform transition-all duration-500 hover:border-white/25 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="text-center md:text-left max-w-xl">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Join Our Protected Network</h3>
                  <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                    Get enterprise-grade DDoS protection designed for FiveM/RedM. Keep your community online, secure, and lag-free.
                  </p>
                  <ul className="space-y-3 mb-8 text-gray-300 text-left text-sm md:text-base list-none pl-0">
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      Multi-Layer L4 & L7 Mitigation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      Simple Integration & Dynamic Routing
                    </li>
                    <li className="flex items-center">
                       <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                       Cloudflare CDN for Optimized Content
                    </li>
                     <li className="flex items-center">
                       <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                       Recommended for OVHcloud Infrastructure
                    </li>
                  </ul>
                </div>

                <div className="w-full md:w-auto flex flex-col items-center flex-shrink-0 mt-4 md:mt-0">
                  <a
                    href="https://discord.gg/zucpnTMzHt"
                    target="_blank" rel="noopener noreferrer"
                    className="w-full md:w-auto inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-10 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40 text-center text-base md:text-lg"
                  >
                    Get Started Now
                  </a>
                  <span className="text-gray-400 text-sm mt-3">Join Discord to learn more</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 pt-16 pb-8 px-4 border-t border-white/10">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-12 text-gray-400">
                    {/* Company info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-5">
                             <img
                                src="/blanc.png" // Path in public folder
                                alt="fiveshield Logo"
                                className="h-9 w-9 rounded-md"
                                width={36} height={36}
                                onError={handleImageError}
                             />
                            <span className="text-xl font-bold text-white">fiveshield</span>
                        </div>
                        <p className="text-sm mb-6 max-w-md leading-relaxed">
                            Advanced DDoS protection & performance optimization built specifically for FiveM and RedM server communities.
                        </p>
                         <div className="flex space-x-4">
                            <a href="https://discord.gg/zucpnTMzHt" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="text-gray-400 hover:text-indigo-400 transition-colors p-1">
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" className="h-6 w-6 fill-current"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
                            </a>
                            {/* Add other social links here if needed */}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base font-semibold text-white mb-5 tracking-wide">Quick Links</h3>
                        <ul className="space-y-3 text-sm list-none pl-0">
                            <li><a href="#installation" className="hover:text-indigo-400 transition-colors">Installation</a></li>
                            <li><a href="#architecture" className="hover:text-indigo-400 transition-colors">Architecture</a></li>
                            <li><a href="#caching" className="hover:text-indigo-400 transition-colors">Caching</a></li>
                            <li><a href="#about" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                             <li><a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                         <h3 className="text-base font-semibold text-white mb-5 tracking-wide">Support</h3>
                         <p className="text-sm mb-4 leading-relaxed">
                            Need help or have questions? Join our Discord community.
                         </p>
                        <a
                            href="https://discord.gg/zucpnTMzHt" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors group"
                        >
                            Join Discord <ExternalLink className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform"/>
                        </a>
                    </div>
                </div>

                {/* Copyright bar */}
                <div className="pt-8 mt-8 border-t border-white/10 text-center sm:flex sm:justify-between sm:text-left">
                    <p className="text-xs text-gray-500">© {new Date().getFullYear()} fiveshield. All rights reserved.</p>
                    <div className="mt-4 sm:mt-0 text-xs">
                        {/* Replace # with actual links when available */}
                        <a href="#" className="text-gray-500 hover:text-gray-400 mr-4">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-gray-400">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>

    </div> // End of main container
  ); // End of return statement
} // End of HomePage component