// src/app/page.tsx
'use client'; // Must be at the top

import React, { useState, useEffect, Suspense, lazy, useMemo, useCallback } from 'react'; // Import hooks here
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ShieldCheck, Zap, Server, Cloud, Cpu, Users, ChevronDown, ArrowRight,
  Menu, X, CheckCircle2, ExternalLink, Settings, Layers, Route,
  Shield, Globe, Check, CircleHelp, TriangleAlert // <-- Added missing icons
} from 'lucide-react';

// Lazy load the 3D Globe component (Adjust path if necessary)
const GlobeVisualization = lazy(() => import('./components/GlobeVisualization')); // Assuming it's in src/components

// Animation Variants (can stay outside)
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

// --- Constants (can stay outside) ---
const MIN_PLAYERS = 20;
const MAX_PLAYERS = 1024;

// --- Pricing Logic Functions (can stay outside if they don't depend on hooks/state) ---
const calculateServicePricePerDay = (players: number): number => {
    // Example: Scaled pricing - adjust logic as needed
    if (players <= 100) return 0.9;
    if (players <= 300) return 1.5;
    if (players <= 600) return 2.5;
    return 4.0;
};

const calculateSharedProxyPricePerHour = (players: number): number => {
    // Example: Flat or slightly scaled
    return 0.008 + (players / MAX_PLAYERS) * 0.002; // Small increase with players
};

const calculateDedicatedProxyPricePerHour = (players: number): number => {
    // Example: Flat or slightly scaled
    return 0.012 + (players / MAX_PLAYERS) * 0.005; // Higher base + scales more
};
// --- End Pricing Logic Functions ---


export default function HomePage() {
  // --- Hooks and State MUST be inside the component ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playerCount, setPlayerCount] = useState(50);
  const [selectedPlan, setSelectedPlan] = useState<'dedicated' | 'shared'>('dedicated');

  // Calculate monthly estimates using useMemo
  const servicePricePerMonth = useMemo(() => calculateServicePricePerDay(playerCount) * 30, [playerCount]);
  const sharedPricePerMonth = useMemo(() => calculateSharedProxyPricePerHour(playerCount) * 24 * 30, [playerCount]);
  const dedicatedPricePerMonth = useMemo(() => calculateDedicatedProxyPricePerHour(playerCount) * 24 * 30, [playerCount]);
  const totalPricePerMonth = useMemo(() => {
      const base = servicePricePerMonth;
      const planPrice = selectedPlan === 'shared' ? sharedPricePerMonth : dedicatedPricePerMonth;
      return base + planPrice;
  }, [servicePricePerMonth, sharedPricePerMonth, dedicatedPricePerMonth, selectedPlan]);

  // Handlers using useCallback
  const handlePlayerCountChange = useCallback((value: number | string) => {
      let num = typeof value === 'string' ? parseInt(value, 10) : value;
      if (isNaN(num)) num = MIN_PLAYERS;
      const clampedValue = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, num));
      setPlayerCount(clampedValue);
  }, []); // Empty dependency array means this function doesn't need to be recreated

  const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      handlePlayerCountChange(parseInt(event.target.value, 10));
  }, [handlePlayerCountChange]); // Depends on handlePlayerCountChange

  const handlePlanSelect = useCallback((plan: 'shared' | 'dedicated') => {
      setSelectedPlan(plan);
  }, []); // Empty dependency array

  // Calculate slider percentage using useMemo
  const sliderPercentage = useMemo(() => {
      const range = MAX_PLAYERS - MIN_PLAYERS;
      const valueInRange = playerCount - MIN_PLAYERS;
      // Avoid division by zero if range is 0 (although unlikely with MIN/MAX set)
      if (range === 0) return 0;
      return (valueInRange / range) * 100;
  }, [playerCount]);

  // Recommendation Logic using useMemo
  const recommendedPlan: 'shared' | 'dedicated' | null = useMemo(() => {
      if (playerCount < 100) return 'shared';
      if (playerCount >= 100) return 'dedicated';
      return null;
  }, [playerCount]);

  const showRecommendationWarning = useMemo(() => {
      return recommendedPlan !== null && selectedPlan !== recommendedPlan;
  }, [selectedPlan, recommendedPlan]);

  // --- Other functions inside the component ---
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
     const target = e.target as HTMLImageElement;
     target.onerror = null;
     target.src = `https://placehold.co/${target.width || 40}x${target.height || 40}/FFFFFF/1F2937?text=FS`;
     target.alt = "fiveshield Fallback Logo";
   };

  const handleOvhImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
     const target = e.target as HTMLImageElement;
     target.onerror = null;
     target.style.display = 'none';
   };
  // --- End functions inside component ---

  // --- JSX Return ---
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
             {/* Links with hover effect */}
            <a href="#installation" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
              Installation
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
             <a href="#pricing" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
               Pricing {/* Added Pricing Link */}
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
               {/* Discord Icon SVG */}
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" className="h-5 w-5 fill-current transition-transform duration-300 group-hover:scale-110"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
            </a>
            <a
              href="https://panel.fiveshield.co" // Update link
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
            <a href="#pricing" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">Pricing</a>
            <a href="#architecture" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">Architecture</a>
            <a href="#caching" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">Caching</a>
            <a href="#about" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">About</a>
            <a href="#contact" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">Contact</a>
            <a
              href="https://panel.fiveshield.co" // Update link
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
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="absolute inset-0 bg-gray-900/5" />}>
            <GlobeVisualization />
          </Suspense>
        </div>

        {/* Hero Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="z-10 relative max-w-4xl"
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
            {/* Step 1 Card */}
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
            {/* Step 2 Card */}
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
            {/* Step 3 Card */}
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

      {/* --- Pricing Section --- */}
      <motion.section
        id="pricing"
        className="py-20 md:py-28 px-4 bg-gray-900 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }} // Trigger animation a bit earlier
        variants={staggerContainer}
      >
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 mb-12 md:mb-16 text-center">
          {/* Heading */}
          <motion.div variants={fadeIn} className="inline-block relative">
            <h2 className="tracking-tight inline from-indigo-400 to-purple-400 text-[2.3rem] lg:text-5xl leading-tight font-black bg-clip-text text-transparent bg-gradient-to-b">
              ADAPTEZ-VOUS À VOTRE PROJET
            </h2>
            <p className="z-10 relative text-gray-400 mt-2">
              Notre protection évolue avec votre projet
            </p>
          </motion.div>
        </div>

        {/* Pricing Grid Wrapper */}
        <motion.div
            className="w-full max-w-7xl mx-auto px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
        >
          <div className="grid grid-cols-12 gap-4 md:gap-6">

            {/* --- Player Slider Column --- */}
            <motion.div variants={fadeIn} className="col-span-12 md:col-span-4">
              <div className="flex flex-col relative overflow-hidden text-white box-border outline-none shadow-lg motion-reduce:transition-none p-4 md:p-6 bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-white/10 rounded-xl h-full">
                <div className="flex flex-col">
                  {/* Label and Input */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-200 font-medium text-sm">Pic de joueurs estimé</span>
                    <div className="flex items-center gap-1">
                      <input
                        className="text-white font-bold bg-indigo-500/20 px-2 py-1 rounded-lg w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border border-transparent focus:border-indigo-400 focus:ring-indigo-400 focus:ring-1 focus:outline-none transition"
                        min={MIN_PLAYERS}
                        max={MAX_PLAYERS}
                        type="number"
                        value={playerCount}
                        onChange={(e) => handlePlayerCountChange(e.target.value)}
                      />
                      <span className="text-xs text-gray-400">joueurs</span>
                    </div>
                  </div>
                  {/* Slider Control */}
                  <div className="relative flex items-center w-full h-5 mb-1 cursor-pointer group">
                     <input
                        type="range"
                        min={MIN_PLAYERS}
                        max={MAX_PLAYERS}
                        value={playerCount}
                        onChange={handleSliderChange}
                        // Styling the range input itself with Tailwind plugins for cross-browser consistency
                        className="absolute w-full h-2 bg-indigo-900/30 rounded-full appearance-none cursor-pointer z-10
                                   [&::-webkit-slider-runnable-track]:rounded-full
                                   [&::-webkit-slider-runnable-track]:bg-transparent
                                   [&::-moz-range-track]:rounded-full
                                   [&::-moz-range-track]:bg-transparent

                                   [&::-webkit-slider-thumb]:appearance-none
                                   [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                                   [&::-webkit-slider-thumb]:rounded-full
                                   [&::-webkit-slider-thumb]:bg-indigo-500
                                   [&::-webkit-slider-thumb]:shadow-lg
                                   [&::-webkit-slider-thumb]:border-2
                                   [&::-webkit-slider-thumb]:border-indigo-300
                                   [&::-webkit-slider-thumb]:cursor-pointer
                                   group-hover:[&::-webkit-slider-thumb]:bg-indigo-400
                                   focus:[&::-webkit-slider-thumb]:ring-2
                                   focus:[&::-webkit-slider-thumb]:ring-offset-2
                                   focus:[&::-webkit-slider-thumb]:ring-offset-gray-800
                                   focus:[&::-webkit-slider-thumb]:ring-indigo-400

                                   [&::-moz-range-thumb]:appearance-none
                                   [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5
                                   [&::-moz-range-thumb]:rounded-full
                                   [&::-moz-range-thumb]:bg-indigo-500
                                   [&::-moz-range-thumb]:shadow-lg
                                   [&::-moz-range-thumb]:border-2
                                   [&::-moz-range-thumb]:border-indigo-300
                                   [&::-moz-range-thumb]:cursor-pointer
                                   group-hover:[&::-moz-range-thumb]:bg-indigo-400
                                   focus:[&::-moz-range-thumb]:ring-2
                                   focus:[&::-moz-range-thumb]:ring-offset-2
                                   focus:[&::-moz-range-thumb]:ring-offset-gray-800
                                   focus:[&::-moz-range-thumb]:ring-indigo-400

                                   focus:outline-none" // Remove default browser focus outline on track
                      />
                       {/* Background Track */}
                       <div className="absolute top-1/2 left-0 transform -translate-y-1/2 h-2 w-full bg-indigo-900/30 rounded-full pointer-events-none"></div>
                       {/* Track Fill visual */}
                      <div
                          className="absolute top-1/2 left-0 transform -translate-y-1/2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 pointer-events-none"
                          style={{ width: `max(0.5rem, min(calc(${sliderPercentage}% + ${5 - sliderPercentage * 0.1}px), calc(100% - 0.5rem)))` }} // Offset slightly for thumb overlap
                      ></div>
                  </div>
                  {/* Min/Max Labels */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{MIN_PLAYERS}</span>
                    <span>{MAX_PLAYERS}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* --- Service Details Column --- */}
            <motion.div variants={fadeIn} className="col-span-12 md:col-span-8">
              <div className="flex flex-col relative overflow-hidden text-white box-border outline-none shadow-lg motion-reduce:transition-none p-4 md:p-6 bg-gradient-to-br from-gray-800/60 to-gray-900/40 border border-white/10 rounded-xl h-full">
                <div className="flex items-center gap-1 mb-2 md:mb-4">
                  <h3 className="text-base font-bold text-gray-200">Service Inclus</h3>
                  {/* <a title="Learn more about included services" className="text-gray-500 hover:text-indigo-400 transition-colors" href="#" target="_blank"><CircleHelp size={14} /></a> */}
                </div>
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Price */}
                  <div className="md:w-1/4 flex-shrink-0">
                    <div className="flex items-baseline mb-1">
                      <span className="text-xl font-bold">{servicePricePerMonth.toFixed(1)}$ USD</span>
                      <span className="ml-1 text-xs text-gray-400">/mois</span>
                    </div>
                    <p className="text-xs text-gray-500">{calculateServicePricePerDay(playerCount).toFixed(1)}$ USD × 30 jours</p>
                  </div>
                  {/* Features */}
                  <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start">
                      <Check className="mr-1.5 h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-200">CDN haute performance</p>
                        <p className="text-xs text-gray-400">Distribution rapide des contenus</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-1.5 h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-200">Panel administration</p>
                        <p className="text-xs text-gray-400">Interface intuitive</p> {/* Simplified */}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-1.5 h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-200">Support 24/7</p>
                        <p className="text-xs text-gray-400">Assistance technique</p> {/* Simplified */}
                      </div>
                    </div>
                     <div className="flex items-start">
                       <Check className="mr-1.5 h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-200">Protection txAdmin</p>
                        <p className="text-xs text-gray-400">Sécurité supplémentaire</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* --- Shared Proxies Plan --- */}
            <motion.div variants={fadeIn} className="col-span-12 md:col-span-6">
              <div className={`flex flex-col text-white box-border outline-none shadow-lg transition-all duration-300 motion-reduce:transition-none rounded-xl relative overflow-hidden h-full border ${selectedPlan === 'shared' ? 'border-indigo-500 bg-indigo-900/20 ring-2 ring-indigo-500/50' : 'border-white/10 bg-gray-800/50 hover:bg-gray-800/70 hover:border-white/20'}`}>
                <div className="p-4 md:p-6 flex-grow">
                  {/* Header */}
                  <div className="flex items-start sm:items-center gap-3 mb-4"> {/* Changed items-center to items-start on small screens */}
                    <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 flex-shrink-0 mt-0.5 sm:mt-0">
                      <Shield size={16} />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-sm font-bold mr-1 text-gray-100">Proxys Partagés</h3>
                        {/* <a title="Learn more about Shared Proxies" className="..." href="#" target="_blank"><CircleHelp size={14}/></a> */}
                      </div>
                      <p className="text-xs text-gray-400">Protection de base pour petits serveurs</p>
                    </div>
                  </div>
                  {/* Price */}
                  <div className="mb-4"> {/* Removed flex for simpler layout */}
                    <span className="text-2xl font-bold">{sharedPricePerMonth.toFixed(1)}$ USD</span>
                    <span className="text-gray-400 ml-1 text-xs">/mois</span>
                    <p className="text-xs text-gray-500 mt-0.5">Facturé mensuellement, annulez à tout moment</p>
                  </div>
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                      <Zap className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/>
                      <div>
                        <p className="text-xs font-medium text-gray-200">Prix par proxy</p>
                        <p className="text-xs text-gray-400">{calculateSharedProxyPricePerHour(playerCount).toFixed(4)}$ USD/hr</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                       <Globe className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/>
                       <div>
                        <p className="text-xs font-medium text-gray-200">Load-balancing</p>
                        <p className="text-xs text-gray-400">Light</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Shield className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/>
                       <div>
                        <p className="text-xs font-medium text-gray-200">Protection</p>
                        <p className="text-xs text-gray-400">Basique</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                       <Globe className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/>
                       <div>
                        <p className="text-xs font-medium text-gray-200">Régions</p>
                        <p className="text-xs text-gray-400">Limitées</p>
                      </div>
                    </div>
                     <div className="flex items-start">
                       <Server className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/>
                       <div>
                        <p className="text-xs font-medium text-gray-200">Contrôle</p>
                        <p className="text-xs text-gray-400">Standard</p>
                      </div>
                    </div>
                  </div>
                </div>
                 {/* Button */}
                <button
                  className={`w-full rounded-t-none rounded-b-lg h-10 text-center font-semibold text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-indigo-500 ${selectedPlan === 'shared' ? 'bg-indigo-600 text-white cursor-default' : 'bg-gray-700/50 text-gray-300 hover:bg-indigo-700 hover:text-white'}`}
                  type="button"
                  onClick={() => handlePlanSelect('shared')}
                  disabled={selectedPlan === 'shared'}
                >
                  {selectedPlan === 'shared' ? 'Plan Actuel' : 'Sélectionner le plan'}
                </button>
              </div>
            </motion.div>

            {/* --- Dedicated Proxies Plan --- */}
            <motion.div variants={fadeIn} className="col-span-12 md:col-span-6">
               <div className={`flex flex-col text-white box-border outline-none shadow-xl transition-all duration-300 motion-reduce:transition-none rounded-xl relative overflow-hidden h-full border ${selectedPlan === 'dedicated' ? 'border-indigo-500 bg-indigo-900/20 ring-2 ring-indigo-500/50 shadow-indigo-500/20' : 'border-white/10 bg-gray-800/50 hover:bg-gray-800/70 hover:border-white/20'}`}>
                 {/* Recommended Tag */}
                 {recommendedPlan === 'dedicated' && (
                    <div className="absolute -right-11 top-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-0.5 rotate-45 text-xs font-bold shadow-md">
                        RECOMMANDÉ
                    </div>
                 )}
                 <div className="p-4 md:p-6 flex-grow">
                  {/* Header */}
                   <div className="flex items-start sm:items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 flex-shrink-0 mt-0.5 sm:mt-0">
                      <Zap size={16} />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-sm font-bold mr-1 text-gray-100">Proxys Dédiés</h3>
                         {/* <a title="Learn more about Dedicated Proxies" className="..." href="#" target="_blank"><CircleHelp size={14}/></a> */}
                      </div>
                      <p className="text-xs text-gray-400">Protection avancée pour serveurs exigeants</p> {/* Adjusted text */}
                    </div>
                  </div>
                   {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold">{dedicatedPricePerMonth.toFixed(1)}$ USD</span>
                    <span className="text-gray-400 ml-1 text-xs">/mois</span>
                    <p className="text-xs text-gray-500 mt-0.5">Facturé mensuellement, annulez à tout moment</p>
                  </div>
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                      <Zap className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/>
                      <div>
                        <p className="text-xs font-medium text-gray-200">Prix par proxy</p>
                        <p className="text-xs text-gray-400 font-bold">{calculateDedicatedProxyPricePerHour(playerCount).toFixed(4)}$ USD/hr</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                       <Globe className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/>
                       <div>
                        <p className="text-xs font-medium text-gray-200">Load-balancing</p>
                        <p className="text-xs text-gray-400 font-bold">Personnalisé</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Shield className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/>
                       <div>
                        <p className="text-xs font-medium text-gray-200">Protection</p>
                        <p className="text-xs text-gray-400 font-bold">Avancée</p>
                      </div>
                    </div>
                     <div className="flex items-start">
                       <Globe className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/>
                       <div>
                        <p className="text-xs font-medium text-gray-200">Régions</p>
                        <p className="text-xs text-gray-400 font-bold">Toutes disponibles</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                       <Server className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/>
                       <div>
                        <p className="text-xs font-medium text-gray-200">Contrôle</p>
                        <p className="text-xs text-gray-400 font-bold">Total</p>
                      </div>
                    </div>
                  </div>
                </div>
                 {/* Button */}
                <button
                   className={`w-full rounded-t-none rounded-b-lg h-10 text-center font-semibold text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-indigo-500 ${selectedPlan === 'dedicated' ? 'bg-indigo-600 text-white cursor-default' : 'bg-gray-700/50 text-gray-300 hover:bg-indigo-700 hover:text-white'}`}
                   type="button"
                   onClick={() => handlePlanSelect('dedicated')}
                   disabled={selectedPlan === 'dedicated'}
                >
                  {selectedPlan === 'dedicated' ? 'Plan Actuel' : 'Sélectionner le plan'}
                </button>
              </div>
            </motion.div>

            {/* --- Summary/Recommendation Bar --- */}
            <motion.div variants={fadeIn} className="col-span-12">
              <div className="flex flex-col relative overflow-hidden text-white box-border outline-none shadow-lg transition-transform-background motion-reduce:transition-none p-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/20 border border-indigo-700/50 rounded-xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-6">
                  {/* Recommendation Text */}
                  <div className="text-center md:text-left flex-grow">
                    {showRecommendationWarning ? (
                        <p className="text-sm text-yellow-300">
                            <TriangleAlert className="inline mr-1.5 h-4 w-4" />
                            Votre plan actuel (<span className="font-semibold capitalize">{selectedPlan}</span>)
                            pourrait ne pas être optimal. Le plan <span className="font-semibold capitalize">{recommendedPlan}</span> {/* Add space here --> */} est recommandé pour <span className="font-semibold">{playerCount}</span> joueurs.
                        </p>
                     ) : (
                         <p className="text-sm text-gray-300">
                             Le plan <span className="font-semibold capitalize text-indigo-300">{selectedPlan}</span> est sélectionné pour
                             votre estimation de <span className="font-semibold">{playerCount}</span> joueurs.
                         </p>
                     )}
                  </div>
                   {/* Total Price & CTA */}
                  <div className="flex items-center gap-4 flex-shrink-0 mt-3 md:mt-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-0">Prix mensuel total</p>
                      <p className="text-2xl font-bold text-indigo-300">{totalPricePerMonth.toFixed(1)}$ USD</p>
                    </div>
                    <button
                      className="inline-flex items-center justify-center px-6 h-10 text-sm gap-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500"
                      type="button"
                    >
                      Commencer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

          </div> {/* End Grid */}
        </motion.div> {/* End Pricing Grid Wrapper */}
      </motion.section>
      {/* --- End Pricing Section --- */}


      {/* --- Protection Architecture Section --- */}
      <section id="architecture" className="py-20 md:py-28 bg-gradient-to-b from-gray-900 to-gray-800/70 px-4 overflow-hidden">
            {/* ... Content same as before ... */}
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
                <motion.div
                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
                  className="relative max-w-6xl mx-auto pb-10"
                >
                    <div className="flex flex-col items-center w-full">
                        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center w-full gap-6 lg:gap-4 relative">
                            <motion.div variants={fadeIn} className="flex flex-col items-center relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
                                <div className="text-indigo-400 font-semibold mb-3 text-xs tracking-widest">LAYER 7</div>
                                <div className="w-full h-full flex flex-col items-center justify-center bg-purple-600/10 border border-purple-500/30 rounded-lg px-4 py-6 shadow-lg min-h-[180px]"> <Layers className="h-10 w-10 text-purple-400 mb-3" /> <span className="text-base font-semibold text-purple-300">Application Filtering</span> <span className="text-xs text-purple-400/80 mt-1 text-center px-2">Intelligent Bot & Exploit Blocking</span> </div>
                                <ArrowRight className="block lg:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                            </motion.div>
                            <div className="hidden lg:flex items-center pt-10"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                            <motion.div variants={fadeIn} className="flex flex-col items-center relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
                                <div className="text-indigo-400 font-semibold mb-3 text-xs tracking-widest">ASSIGNMENT</div>
                                <div className="w-full h-full flex flex-col items-center justify-center bg-blue-600/10 border border-blue-500/30 rounded-lg px-4 py-6 shadow-lg min-h-[180px]"> <Route className="h-10 w-10 text-blue-400 mb-3" /> <span className="text-base font-semibold text-blue-300">Dynamic API Routing</span> <span className="text-xs text-blue-400/80 mt-1 text-center px-2">Optimized Proxy Selection</span> </div>
                                <ArrowRight className="block lg:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                            </motion.div>
                            <div className="hidden lg:flex items-center pt-10"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                            <motion.div variants={fadeIn} className="flex flex-col items-center relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
                                <div className="text-indigo-400 font-semibold mb-3 text-xs tracking-widest">LAYER 4</div>
                                <div className="w-full h-full flex flex-col items-center justify-center bg-green-600/10 border border-green-500/30 rounded-lg px-4 py-6 shadow-lg min-h-[180px]"> <Server className="h-10 w-10 text-green-400 mb-3" /> <span className="text-base font-semibold text-green-300">Distributed Proxies</span> <span className="text-xs text-green-400/80 mt-1 text-center px-2">Network Attack Mitigation</span> </div>
                                <ArrowRight className="block lg:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                            </motion.div>
                            <div className="hidden lg:flex items-center pt-10"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                            <motion.div variants={fadeIn} className="flex flex-col items-center relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
                                <div className="text-indigo-400 font-semibold mb-3 text-xs tracking-widest">ORIGIN</div>
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-600/10 border border-gray-500/30 rounded-lg px-4 py-6 shadow-lg min-h-[180px]"> <Cpu className="h-10 w-10 text-gray-400 mb-3" /> <span className="text-base font-semibold text-gray-300">Your Server</span> <span className="text-xs text-gray-400/80 mt-1 text-center px-2">Protected & Online</span> </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16 md:mt-20">
                    <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer group"> <h3 className="text-xl font-semibold mb-2 text-purple-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Layers size={20} className="mr-2 group-hover:scale-110 transition-transform"/>Layer 7 Protection</h3> <p className="text-gray-400 text-sm leading-relaxed">Inspects application traffic to filter bots and exploits, verifying legitimate players.</p> </motion.div>
                    <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer group"> <h3 className="text-xl font-semibold mb-2 text-blue-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Route size={20} className="mr-2 group-hover:scale-110 transition-transform"/>Dynamic Assignment</h3> <p className="text-gray-400 text-sm leading-relaxed">Verified players are routed via API to the optimal proxy based on location and load.</p> </motion.div>
                    <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-green-500/10 cursor-pointer group"> <h3 className="text-xl font-semibold mb-2 text-green-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Server size={20} className="mr-2 group-hover:scale-110 transition-transform"/>Distributed L4 Proxies</h3> <p className="text-gray-400 text-sm leading-relaxed">Our proxy network absorbs and mitigates high-volume network-level DDoS attacks.</p> </motion.div>
                </motion.div>
            </div>
      </section>

      {/* --- Caching System Section --- */}
       <section id="caching" className="py-20 md:py-28 bg-gray-900 px-4 overflow-hidden">
            {/* ... Content same as before ... */}
            <div className="container mx-auto text-center">
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold mb-6 text-white">Optimized Content Delivery </motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-lg md:text-xl text-gray-400 mb-16 md:mb-20 max-w-3xl mx-auto leading-relaxed"> Leveraging Cloudflare's global CDN significantly reduces download times and your server's bandwidth load. </motion.p>
                 <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="relative max-w-5xl mx-auto pb-10">
                    <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-6 md:gap-8">
                         <motion.div variants={fadeIn} className="flex flex-col items-center w-full max-w-xs">
                             <div className="text-green-400 font-semibold mb-3 text-xs tracking-widest">PLAYER</div>
                             <div className="w-full flex flex-col items-center justify-center bg-green-600/10 border border-green-500/30 rounded-lg px-4 py-6 shadow-lg text-center min-h-[180px]"> <Users className="h-10 w-10 text-green-400 mb-3"/> <span className="text-base font-semibold text-green-300">Client Request</span> <span className="text-xs text-green-400/80 mt-1">Downloads Resources</span> </div>
                             <ArrowRight className="block md:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                         </motion.div>
                         <div className="hidden md:flex items-center"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                         <motion.div variants={fadeIn} className="flex flex-col items-center w-full max-w-xs">
                             <div className="text-orange-400 font-semibold mb-3 text-xs tracking-widest">CLOUDFLARE</div>
                             <div className="w-full flex flex-col items-center justify-center bg-orange-600/10 border border-orange-500/30 rounded-lg px-4 py-6 shadow-lg text-center min-h-[180px]"> <Cloud className="h-10 w-10 text-orange-400 mb-3"/> <span className="text-base font-semibold text-orange-300">Global CDN</span> <span className="text-xs text-orange-400/80 mt-1">Serves Cached Content</span> </div>
                             <ArrowRight className="block md:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                         </motion.div>
                          <div className="hidden md:flex items-center"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                          <motion.div variants={fadeIn} className="flex flex-col items-center w-full max-w-xs">
                             <div className="text-blue-400 font-semibold mb-3 text-xs tracking-widest">YOUR SERVER</div>
                             <div className="w-full flex flex-col items-center justify-center bg-blue-600/10 border border-blue-500/30 rounded-lg px-4 py-6 shadow-lg text-center min-h-[180px]"> <Cpu className="h-10 w-10 text-blue-400 mb-3"/> <span className="text-base font-semibold text-blue-300">Origin Server</span> <span className="text-xs text-blue-400/80 mt-1">Reduced Bandwidth Load</span> </div>
                         </motion.div>
                    </div>
                 </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16 md:mt-20">
                    <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer group"> <h3 className="text-xl font-semibold mb-2 text-orange-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Cloud size={20} className="mr-2 group-hover:scale-110 transition-transform"/>Cloudflare CDN</h3> <p className="text-gray-400 text-sm leading-relaxed">Players download from Cloudflare's closest edge location for ultra-fast speeds worldwide.</p> </motion.div>
                     <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer group"> <h3 className="text-xl font-semibold mb-2 text-blue-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Zap size={20} className="mr-2 group-hover:scale-110 transition-transform"/>Reduced Server Load</h3> <p className="text-gray-400 text-sm leading-relaxed">Caching dramatically reduces your server's bandwidth usage, freeing up resources for gameplay.</p> </motion.div>
                </motion.div>
           </div>
        </section>

      {/* --- About Section --- */}
       <section id="about" className="py-20 md:py-28 bg-gradient-to-b from-gray-800/70 to-gray-900 px-4">
            {/* ... Content same as before ... */}
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="container mx-auto max-w-4xl text-center p-8 md:p-12 bg-gray-800/60 rounded-xl border border-white/10 shadow-lg relative overflow-hidden backdrop-blur-sm" >
                 <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-600/10 rounded-full filter blur-3xl opacity-50 z-[-1]"></div>
                 <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full filter blur-3xl opacity-50 z-[-1]"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold mb-8 text-white">About FiveShield</h2>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed"> FiveShield provides specialized DDoS mitigation for FiveM/RedM. Our intelligent multi-layer infrastructure filters malicious traffic while ensuring seamless, low-latency gameplay for legitimate players. </p>
                    <div className="mt-10 p-6 bg-gradient-to-r from-white/5 to-white/10 rounded-lg border border-white/15 transform transition-all duration-300 hover:shadow-lg hover:border-white/25">
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center justify-center"><ShieldCheck size={24} className="mr-2 text-green-400"/>Recommended Infrastructure</h3>
                        <img src="/ovhcloud.png" alt="OVH Cloud Logo" className="h-12 mx-auto mb-5 opacity-80 hover:opacity-100 transition-opacity duration-300 object-contain" width={180} height={48} onError={handleOvhImageError} />
                        <p className="text-base text-gray-300"> For optimal resilience, we <strong className="text-white">highly recommend OVHcloud</strong> as your origin server provider. Our system integrates tightly with OVH's network for enhanced protection against complex attacks. </p>
                    </div>
                </div>
            </motion.div>
        </section>

      {/* --- Contact/Call to Action Section --- */}
       <section id="contact" className="py-20 md:py-32 px-4 relative">
            {/* ... Content same as before ... */}
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-indigo-900/40 to-gray-900 opacity-95 z-0"></div>
          <div className="container mx-auto max-w-4xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="text-center mb-12 md:mb-16" > <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">Ready to Secure Your Server?</h2> <div className="w-28 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div> </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 shadow-xl p-8 md:p-12 transform transition-all duration-500 hover:border-white/25 hover:shadow-2xl hover:shadow-indigo-500/10" >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="text-center md:text-left max-w-xl">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Join Our Protected Network</h3>
                  <p className="text-lg text-gray-300 mb-8 leading-relaxed"> Get enterprise-grade DDoS protection designed for FiveM/RedM. Keep your community online, secure, and lag-free. </p>
                  <ul className="space-y-3 mb-8 text-gray-300 text-left text-sm md:text-base list-none pl-0"> <li className="flex items-center"> <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /> Multi-Layer L4 & L7 Mitigation </li> <li className="flex items-center"> <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /> Simple Integration & Dynamic Routing </li> <li className="flex items-center"> <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /> Cloudflare CDN for Optimized Content </li> </ul>
                </div>
                <div className="w-full md:w-auto flex flex-col items-center flex-shrink-0 mt-4 md:mt-0"> 
                  <a href="#pricing" 
                   className="w-full md:w-auto inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-10 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40 text-center text-base md:text-lg"
                  > 
                  See Pricing Options 
                  </a> 
                  <span className="text-gray-400 text-sm mt-3">Check our flexible pricing plans</span> 
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 pt-16 pb-8 px-4 border-t border-white/10">
            {/* ... Content same as before ... */}
             <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-12 text-gray-400">
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-5"> <img src="/blanc.png" alt="fiveshield Logo" className="h-9 w-9 rounded-md" width={36} height={36} onError={handleImageError} /> <span className="text-xl font-bold text-white">fiveshield</span> </div>
                        <p className="text-sm mb-6 max-w-md leading-relaxed"> Advanced DDoS protection & performance optimization built specifically for FiveM and RedM server communities. </p>
                         <div className="flex space-x-4"> <a href="https://discord.gg/zucpnTMzHt" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="text-gray-400 hover:text-indigo-400 transition-colors p-1"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" className="h-6 w-6 fill-current"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg> </a> </div>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-white mb-5 tracking-wide">Quick Links</h3>
                        <ul className="space-y-3 text-sm list-none pl-0"> <li><a href="#installation" className="hover:text-indigo-400 transition-colors">Installation</a></li> <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a></li> <li><a href="#architecture" className="hover:text-indigo-400 transition-colors">Architecture</a></li> <li><a href="#caching" className="hover:text-indigo-400 transition-colors">Caching</a></li> <li><a href="#about" className="hover:text-indigo-400 transition-colors">About Us</a></li> <li><a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a></li> </ul>
                    </div>
                    <div>
                         <h3 className="text-base font-semibold text-white mb-5 tracking-wide">Support</h3>
                         <p className="text-sm mb-4 leading-relaxed"> Need help or have questions? Join our Discord community. </p>
                        <a href="https://discord.gg/zucpnTMzHt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors group" > Join Discord <ExternalLink className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform"/> </a>
                    </div>
                </div>
                <div className="pt-8 mt-8 border-t border-white/10 text-center sm:flex sm:justify-between sm:text-left">
                    <p className="text-xs text-gray-500">© {new Date().getFullYear()} fiveshield. All rights reserved.</p>
                    <div className="mt-4 sm:mt-0 text-xs"> <a href="#" className="text-gray-500 hover:text-gray-400 mr-4">Privacy Policy</a> <a href="#" className="text-gray-500 hover:text-gray-400">Terms of Service</a> </div>
                </div>
            </div>
        </footer>

    </div> // End of main container
  ); // End of return statement
} // End of HomePage component