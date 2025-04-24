// src/app/page.tsx
'use client'; // Must be at the top

// Optimize i18n import to use the enhanced initialization
import { initI18n } from '../i18n';
initI18n(); // Explicitly initialize once before component renders

import React, { useState, useEffect, Suspense, lazy, useMemo, useCallback } from 'react';
// Remove Head import: import Head from 'next/head';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  ShieldCheck, Zap, Server, Cloud, Cpu, Users, ChevronDown, ArrowRight,
  Menu, X, CheckCircle2, ExternalLink, Settings, Layers, Route,
  Shield, Globe, Check
} from 'lucide-react';

const GlobeVisualization = lazy(() => import('./components/GlobeVisualization'));

// --- Constants --- (Keep outside)
const MIN_PLAYERS = 20;
const MAX_PLAYERS = 2048;
const CURRENT_YEAR = new Date().getFullYear();

// --- Pricing Logic Functions (can stay outside if they don't depend on hooks/state) ---
const calculateServicePricePerDay = (players: number): number => {
  // Base pricing tiers
  let basePricePerDay = 0;
  if (players <= 100) basePricePerDay = 2.0;
  else if (players <= 300) basePricePerDay = 3.5;
  else if (players <= 600) basePricePerDay = 5.0;
  else basePricePerDay = 7.5;

  // Cache storage cost adjusted based on number of players
  const monthlyCacheCost = 150 * 0.015; // = 2.25 USD/month at 170 players
  const dailyCacheCost = (monthlyCacheCost / 30) * (players / 170); // scales with player count

  // API operations costs (assumed daily usage)
  const dailyReadOps = 400000;
  const dailyWriteOps = 500;
  const costPerRead = 0.36 / 1_000_000;
  const costPerWrite = 4.5 / 1_000_000;
  const dailyReadCost = dailyReadOps * costPerRead;
  const dailyWriteCost = dailyWriteOps * costPerWrite;

  // Sum up all daily costs
  let dailyCost = basePricePerDay + dailyCacheCost + dailyReadCost + dailyWriteCost;

  // Add service profit margin (50% profit)
  const profitMargin = 1.30;
  dailyCost = dailyCost * profitMargin;

  return dailyCost;
};

const calculateDedicatedProxyPricePerHour = (players: number): number => {
  const proxies = Math.max(Math.ceil(players / 16), 5);
  const costPerProxy = 0.013;
  return proxies * costPerProxy;
};
// --- End Pricing Logic Functions ---

// --- Animation Variants --- (Keep outside)
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

// --- Remove Debounce Hook ---
/*
function useDebounce<T>(value: T, delay: number): T {
  // ... removed debounce hook code ...
}
*/


export default function HomePage() {
  // *** 3. Use the useTranslation hook ***
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language; // Get current language ('en', 'fr', etc.)

  // --- Hooks and State ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State for immediate slider/input feedback
  const [immediatePlayerCount, setImmediatePlayerCount] = useState(50);
  // Remove debounced state: const debouncedPlayerCount = useDebounce(immediatePlayerCount, 250); // Debounce by 250ms
  const [isClient, setIsClient] = useState(false); // State for hydration fix

  // --- Memos & Callbacks --- (Calculations remain the same, text passed to t())
  // Calculate prices based on the immediate player count for smoothness
  const servicePricePerMonth = useMemo(() => calculateServicePricePerDay(immediatePlayerCount) * 30, [immediatePlayerCount]);
  const dedicatedPricePerMonth = useMemo(() => calculateDedicatedProxyPricePerHour(immediatePlayerCount) * 24 * 30, [immediatePlayerCount]);

  // Update the immediate value instantly for responsive UI
  const handlePlayerCountChange = useCallback((value: number | string) => {
      let num = typeof value === 'string' ? parseInt(value, 10) : value;
      if (isNaN(num)) num = MIN_PLAYERS;
      const clampedValue = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, num));
      setImmediatePlayerCount(clampedValue); // Update immediate state
  }, []); // Empty dependency array

  const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      handlePlayerCountChange(parseInt(event.target.value, 10));
  }, [handlePlayerCountChange]); // Depends on handlePlayerCountChange

  // Slider percentage should reflect the immediate value for smoothness
  const sliderPercentage = useMemo(() => {
      const range = MAX_PLAYERS - MIN_PLAYERS;
      const valueInRange = immediatePlayerCount - MIN_PLAYERS;
      if (range === 0) return 0;
      return (valueInRange / range) * 100;
  }, [immediatePlayerCount]);

  // Add the changeLanguage function
  const changeLanguage = useCallback((lng: 'en' | 'fr') => {
    i18n.changeLanguage(lng);
    setMobileMenuOpen(false); // Close menu on language change
  }, [i18n]);

  // Effects are also called on every render
  useEffect(() => {
    // This effect runs only once on the client after initial mount
    setIsClient(true);

    // Memory cleanup in development
    if (process.env.NODE_ENV === 'development') {
      return () => {
        // Cleanup logic if needed
      };
    }
  }, []); // Empty dependency array ensures it runs only once
  
  // Simplify language effect to only run when language changes after initial load
  useEffect(() => {
    if (isClient && currentLanguage) {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage, isClient]);

  // --- Other functions ---
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Add memo for expensive image error handlers
  const memoizedHandleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = `https://placehold.co/${target.width || 40}x${target.height || 40}/FFFFFF/1F2937?text=FS`;
    target.alt = t('fallbackLogoAlt');
  }, [t]);

  const memoizedHandleOvhImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.style.display = 'none';
  }, []);

  // Use a lighter-weight fallback for Suspense to improve perception of speed
  const renderLoader = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 text-white text-xl font-semibold">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mb-4"></div>
        <span>Loading...</span>
      </div>
    </div>
  );

  if (!isClient) {
    return renderLoader();
  }

  // --- JSX Return ---
  return (
    <Suspense fallback={renderLoader()}>
      {/* Remove Head component for preloading */}
      {/* <Head>
        <link rel="preload" href="/blanc.png" as="image" />
      </Head> */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/40 text-white font-sans overflow-x-hidden">

        {/* --- Navigation Bar --- */}
        <nav className="sticky top-0 z-50 bg-gray-900/70 backdrop-blur-lg p-4 border-b border-white/10 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo - Optimized with Next.js Image */}
            <a href="#" className="flex items-center space-x-2 group flex-shrink-0">
              <div className="relative h-10 w-10 rounded-md overflow-hidden">
                <Image
                  src="/blanc.png"
                  alt={t('fallbackLogoAlt') || "FiveShield Logo"}
                  className="transition-transform duration-300 group-hover:scale-110"
                  fill
                  sizes="40px"
                  priority // This is above the fold, so mark as priority
                  onError={memoizedHandleImageError}
                />
              </div>
              <span className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-indigo-400">
                {t('fiveshield')}
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-6 flex-grow justify-center items-center text-gray-300 text-sm lg:text-base">
              <a href="#installation" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
                {t('nav.installation')}
                <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#pricing" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
                {t('nav.pricing')}
                <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#architecture" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
                {t('nav.architecture')}
                <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#caching" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
                {t('nav.caching')}
                <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#about" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
                {t('nav.about')}
                <span className="absolute left-0 -bottom-0.5 w-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#contact" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
                {t('nav.contact')}
                <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* Desktop Right Side (Discord + Panel + Lang Switcher) */}
            <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
              {/* Language Switcher */}
              <div className="flex items-center space-x-1 text-xs border border-white/10 rounded-md p-0.5">
                <button
                    onClick={() => changeLanguage('en')}
                    className={`px-1.5 py-0.5 rounded transition-colors ${currentLanguage === 'en' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    aria-pressed={currentLanguage === 'en'}
                    aria-label="Switch to English"
                >
                    EN
                </button>
                <button
                    onClick={() => changeLanguage('fr')}
                    className={`px-1.5 py-0.5 rounded transition-colors ${currentLanguage === 'fr' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    aria-pressed={currentLanguage === 'fr'}
                    aria-label="Switch to French"
                >
                    FR
                </button>
              </div>
              {/* Discord */}
              <a
                href="https://discord.gg/zucpnTMzHt"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-gray-400 hover:text-indigo-400 transition-colors duration-300 p-1"
                aria-label={t('nav.discordAria')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" className="h-5 w-5 fill-current transition-transform duration-300 group-hover:scale-110"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
              </a>
            </div>

            {/* Mobile Menu Button & Discord Icon */}
            <div className="md:hidden flex items-center space-x-3">
              <a
                href="https://discord.gg/zucpnTMzHt"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-gray-400 hover:text-indigo-400 transition-colors duration-300 p-1"
                aria-label={t('nav.discordAria')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" className="h-5 w-5 fill-current transition-transform duration-300 group-hover:scale-110"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none p-1"
                aria-label={mobileMenuOpen ? t('nav.closeMenuAria') : t('nav.openMenuAria')}
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
              <a href="#installation" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">{t('nav.installation')}</a>
              <a href="#pricing" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">{t('nav.pricing')}</a>
              <a href="#architecture" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">{t('nav.architecture')}</a>
              <a href="#caching" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">{t('nav.caching')}</a>
              <a href="#about" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">{t('nav.about')}</a>
              <a href="#contact" onClick={handleNavLinkClick} className="py-2 px-3 hover:bg-indigo-500/20 rounded-md transition-colors duration-300 block">{t('nav.contact')}</a>

              {/* Mobile Language Switcher */}
              <div className="flex justify-center items-center space-x-2 mt-3 border-t border-white/10 pt-3">
                 <span className="text-sm text-gray-400">{t('nav.language')}:</span>
                  <button
                      onClick={() => changeLanguage('en')}
                      className={`px-2 py-1 rounded text-sm transition-colors ${currentLanguage === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-indigo-700'}`}
                      aria-pressed={currentLanguage === 'en'}
                      aria-label={t('nav.switchToEnglish')}
                  >
                      EN
                  </button>
                  <button
                      onClick={() => changeLanguage('fr')}
                      className={`px-2 py-1 rounded text-sm transition-colors ${currentLanguage === 'fr' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-indigo-700'}`}
                      aria-pressed={currentLanguage === 'fr'}
                      aria-label={t('nav.switchToFrench')}
                  >
                      FR
                  </button>
              </div>
            </div>
          </motion.div>
        </nav>

        {/* --- Hero Section --- */}
        <section id="hero" className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900/30 to-gray-900 text-center px-4 overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20">
          <div className="absolute inset-0 z-0">
            <Suspense fallback={<div className="absolute inset-0 bg-gray-900/5" />}>
              <GlobeVisualization />
            </Suspense>
          </div>
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="z-10 relative max-w-4xl">
            <motion.h1 variants={fadeIn} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-5 md:mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-indigo-400">
              {t('hero.title')}
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg sm:text-xl md:text-2xl text-gray-300/90 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href="#installation" className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30">
                {t('hero.learnMore')} <ChevronDown className="ml-2 h-5 w-5" />
              </a>
              <a href="#contact" className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
                {t('hero.getStarted')} <ArrowRight className="ml-2 h-5 w-5" />
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
               {/* Use Trans component for HTML within translations */}
               <Trans i18nKey="installation.title">
                 Simple Setup, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Powerful Protection</span>
               </Trans>
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
                <h3 className="text-2xl font-semibold mb-3 text-white">{t('installation.step1Title')}</h3>
                <p className="text-gray-400 text-sm md:text-base">{t('installation.step1Desc')}</p>
              </motion.div>
              {/* Step 2 Card */}
              <motion.div
                variants={fadeIn}
                className="group p-6 md:p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/40 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/20 flex flex-col items-center"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Settings size={28} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">{t('installation.step2Title')}</h3>
                <p className="text-gray-400 text-sm md:text-base">{t('installation.step2Desc')}</p>
              </motion.div>
              {/* Step 3 Card */}
              <motion.div
                variants={fadeIn}
                className="group p-6 md:p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/40 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/20 flex flex-col items-center"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">{t('installation.step3Title')}</h3>
                <p className="text-gray-400 text-sm md:text-base">{t('installation.step3Desc')}</p>
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
                 {t('pricing.title')}
              </h2>
              <p className="z-10 relative text-gray-400 mt-2">
                 {t('pricing.subtitle')}
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
                      <span className="text-gray-200 font-medium text-sm">{t('pricing.playerPeakLabel')}</span>
                      <div className="flex items-center gap-1">
                        <input
                          className="text-white font-bold bg-indigo-500/20 px-2 py-1 rounded-lg w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border border-transparent focus:border-indigo-400 focus:ring-indigo-400 focus:ring-1 focus:outline-none transition"
                          min={MIN_PLAYERS}
                          max={MAX_PLAYERS}
                          type="number"
                          // Use immediatePlayerCount for the input value for responsiveness
                          value={immediatePlayerCount}
                          onChange={(e) => handlePlayerCountChange(e.target.value)}
                        />
                        <span className="text-xs text-gray-400">{t('pricing.playersUnit')}</span>
                      </div>
                    </div>
                    {/* Slider Control */}
                    <div className="relative flex items-center w-full h-5 mb-1 cursor-pointer group">
                       <input
                          type="range"
                          min={MIN_PLAYERS}
                          max={MAX_PLAYERS}
                          // Use immediatePlayerCount for the slider value for responsiveness
                          value={immediatePlayerCount}
                          onChange={handleSliderChange}
                          className="absolute w-full h-2 bg-indigo-900/30 rounded-full appearance-none cursor-pointer z-10
                                     [&::-webkit-slider-runnable-track]:rounded-full
                                     [&::-webkit-slider-runnable-track]:bg-transparent
                                     [&::-moz-range-track]:rounded-full
                                     [&::-moz-range-track]:bg-transparent
                                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-300 [&::-webkit-slider-thumb]:cursor-pointer group-hover:[&::-webkit-slider-thumb]:bg-indigo-400 focus:[&::-webkit-slider-thumb]:ring-2 focus:[&::-webkit-slider-thumb]:ring-offset-2 focus:[&::-webkit-slider-thumb]:ring-offset-gray-800 focus:[&::-webkit-slider-thumb]:ring-indigo-400
                                     [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-500 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-indigo-300 [&::-moz-range-thumb]:cursor-pointer group-hover:[&::-moz-range-thumb]:bg-indigo-400 focus:[&::-moz-range-thumb]:ring-2 focus:[&::-moz-range-thumb]:ring-offset-2 focus:[&::-moz-range-thumb]:ring-offset-gray-800 focus:[&::-moz-range-thumb]:ring-indigo-400
                                     focus:outline-none"
                        />
                         <div className="absolute top-1/2 left-0 transform -translate-y-1/2 h-2 w-full bg-indigo-900/30 rounded-full pointer-events-none"></div>
                        <div
                            className="absolute top-1/2 left-0 transform -translate-y-1/2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 pointer-events-none"
                            // Style based on immediatePlayerCount via sliderPercentage
                            style={{ width: `max(0.5rem, min(calc(${sliderPercentage}% + ${5 - sliderPercentage * 0.1}px), calc(100% - 0.5rem)))` }}
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
                    <h3 className="text-base font-bold text-gray-200">{t('pricing.includedServicesTitle')}</h3>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* Price - Uses servicePricePerMonth (already debounced) */}
                    <div className="md:w-1/4 flex-shrink-0">
                      <div className="flex items-baseline mb-1">
                        <span className="text-xl font-bold">{servicePricePerMonth.toFixed(1)}$ USD</span>
                        <span className="ml-1 text-xs text-gray-400">{t('pricing.monthlySuffix')}</span>
                      </div>
                      {/* Use immediatePlayerCount for daily calculation display */}
                      <p className="text-xs text-gray-500">{t('pricing.dailyCalculation', { price: calculateServicePricePerDay(immediatePlayerCount).toFixed(1) })}</p>
                    </div>
                    {/* Features */}
                    <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start"> <Check className="mr-1.5 h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" /> <div> <p className="text-xs font-medium text-gray-200">{t('pricing.cdnFeatureTitle')}</p> <p className="text-xs text-gray-400">{t('pricing.cdnFeatureDesc')}</p> </div> </div>
                      <div className="flex items-start"> <Check className="mr-1.5 h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" /> <div> <p className="text-xs font-medium text-gray-200">{t('pricing.supportFeatureTitle')}</p> <p className="text-xs text-gray-400">{t('pricing.supportFeatureDesc')}</p> </div> </div>
                    </div>
                  </div>
                </div>
              </motion.div>

                {/* --- Dedicated Proxies Plan --- */}
                <motion.div variants={fadeIn} className="col-span-12 md:col-span-12">
                 <div className={`flex flex-col text-white box-border outline-none shadow-xl transition-all duration-300 motion-reduce:transition-none rounded-xl relative overflow-hidden h-full border border-indigo-500 bg-indigo-900/20 ring-2 ring-indigo-500/50 shadow-indigo-500/20`}>
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600/80 to-purple-600/80"></div>
                   <div className="p-4 md:p-6 flex-grow">
                   <div className="flex items-start sm:items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 flex-shrink-0 mt-0.5 sm:mt-0"> <Zap size={16} /> </div>
                    <div> 
                    <div className="flex items-center flex-wrap gap-2"> 
                      <h3 className="text-sm font-bold mr-1 text-gray-100">{t('pricing.dedicatedPlanTitle')}</h3> 
                      <span className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded-full">{t('pricing.ddosProtected')}</span>
                    </div> 
                    <p className="text-xs text-gray-300">{t('pricing.dedicatedPlanDesc')}</p> 
                    </div>
                  </div>
                  <div className="mb-4 bg-indigo-900/20 p-3 rounded-lg">
                    {/* Use dedicatedPricePerMonth (already debounced) */}
                    <span className="text-2xl font-bold">{dedicatedPricePerMonth.toFixed(1)}$ USD</span>
                    <span className="text-gray-300 ml-1 text-xs">{t('pricing.monthlySuffix')}</span>
                    <div className="mt-1 flex items-center">
                    <div className="bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300 text-xs mr-2">{t('pricing.bestPerformance')}</div>
                    <p className="text-xs text-gray-300">{t('pricing.noCommitment')}</p>
                    </div>
                  </div>
                  
                  {/* Feature grid - now organized in a grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-800/40 p-3 rounded-lg flex items-start"> 
                      <Zap className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/> 
                      <div> 
                        <p className="text-xs font-medium text-gray-200">{t('pricing.proxyPricingLabel')}</p>
                        <p className="text-xs text-gray-300">
                          {/* Use immediatePlayerCount for proxy count and price calculation */}
                          <span className="font-medium text-white">{Math.max(Math.ceil(immediatePlayerCount / 16), 5)} × {calculateDedicatedProxyPricePerHour(immediatePlayerCount / Math.max(Math.ceil(immediatePlayerCount / 16), 5)).toFixed(4)}$ </span>
                          {t('pricing.proxyPricingUnit')}
                        </p> 
                      </div> 
                    </div>
                    
                    <div className="bg-gray-800/40 p-3 rounded-lg flex items-start"> 
                      <Globe className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/> 
                      <div> 
                        <p className="text-xs font-medium text-gray-200">{t('pricing.dynamicAssignmentLabel')}</p> 
                        <p className="text-xs text-gray-300">
                          <Check className="inline h-3 w-3 text-green-400 mr-1" />
                          {t('pricing.dynamicAssignmentDedicated')}
                        </p> 
                      </div> 
                    </div>
                    
                    <div className="bg-gray-800/40 p-3 rounded-lg flex items-start"> 
                      <Shield className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/> 
                      <div> 
                        <p className="text-xs font-medium text-gray-200">{t('pricing.uptimeLabel')}</p> 
                        <p className="text-xs text-gray-300">
                          <Check className="inline h-3 w-3 text-green-400 mr-1" />
                          99.9%
                        </p> 
                      </div> 
                    </div>
                    
                    <div className="bg-gray-800/40 p-3 rounded-lg flex items-start"> 
                      <Globe className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/> 
                      <div> 
                        <p className="text-xs font-medium text-gray-200">{t('pricing.regionsLabel')}</p> 
                        <p className="text-xs text-gray-300">{t('pricing.regionsDedicated')}</p> 
                      </div> 
                    </div>
                    
                    <div className="bg-gray-800/40 p-3 rounded-lg flex items-start"> 
                      <Shield className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/> 
                      <div> 
                        <p className="text-xs font-medium text-gray-200">{t('pricing.ddosProtectionLabel')}</p> 
                        <p className="text-xs text-gray-300">{t('pricing.ddosCapacity')}</p> 
                      </div> 
                    </div>
                    
                    <div className="bg-gray-800/40 p-3 rounded-lg flex items-start"> 
                      <Zap className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/> 
                      <div> 
                        <p className="text-xs font-medium text-gray-200">{t('pricing.pingLabel')}</p> 
                        <p className="text-xs text-gray-300">{t('pricing.pingValue')}</p> 
                      </div> 
                    </div>
                  </div>
                    
                  <div className="text-center mx-auto max-w-xl bg-indigo-600/10 p-3 rounded-lg border border-indigo-500/20">
                    <p className="text-sm text-indigo-300">
                      <span className="font-medium">{t('pricing.idealForDescription')}</span>
                    </p>
                  </div>
                  </div>
                </div>
                </motion.div>

              {/* --- Summary/Recommendation Bar --- */}
              <motion.div variants={fadeIn} className="col-span-12">
                <div className="flex flex-col relative overflow-hidden text-white box-border outline-none shadow-lg transition-transform-background motion-reduce:transition-none p-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/20 border border-indigo-700/50 rounded-xl">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-6">
                    {/* Estimated Total Text */}
                    <div className="text-center md:text-left flex-grow">
                      <p className="text-sm text-gray-300">
                        {t('pricing.estimatedBilling')}
                      </p>
                    </div>
                    {/* Total Price & CTA */}
                    <div className="flex items-center gap-4 flex-shrink-0 mt-3 md:mt-0">
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-0">{t('pricing.totalPriceLabel')}</p>
                        {/* Use immediate values for total */}
                        <p className="text-2xl font-bold text-indigo-300">{(servicePricePerMonth + dedicatedPricePerMonth).toFixed(1)}$ USD</p>
                      </div>
                      <a
                        href="https://discord.gg/zucpnTMzHt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 h-10 text-sm gap-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500"
                      >
                        {t('pricing.startNowButton')} <ExternalLink className="h-4 w-4 ml-0.5" />
                      </a>
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
          <div className="container mx-auto text-center">
              <motion.h2
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}
                  className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  {t('architecture.title')}
              </motion.h2>
               <motion.p
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg md:text-xl text-gray-400 mb-16 md:mb-20 max-w-3xl mx-auto leading-relaxed">
                  {t('architecture.subtitle')}
              </motion.p>
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
                className="relative max-w-6xl mx-auto pb-10"
              >
                  <div className="flex flex-col items-center w-full">
                      <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center w-full gap-6 lg:gap-4 relative">
                          {/* Layer 7 */}
                          <motion.div variants={fadeIn} className="flex flex-col items-center relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
                              <div className="text-indigo-400 font-semibold mb-3 text-xs tracking-widest">{t('architecture.layer7')}</div>
                              <div className="w-full h-full flex flex-col items-center justify-center bg-purple-600/10 border border-purple-500/30 rounded-lg px-4 py-6 shadow-lg min-h-[180px]">
                                <Layers className="h-10 w-10 text-purple-400 mb-3" />
                                <span className="text-base font-semibold text-purple-300">{t('architecture.layer7Title')}</span>
                                <span className="text-xs text-purple-400/80 mt-1 text-center px-2">{t('architecture.layer7Desc')}</span>
                              </div>
                              <ArrowRight className="block lg:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                          </motion.div>
                          <div className="hidden lg:flex items-center pt-10"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                          {/* Assignment */}
                          <motion.div variants={fadeIn} className="flex flex-col items-center relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
                              <div className="text-indigo-400 font-semibold mb-3 text-xs tracking-widest">{t('architecture.assignment')}</div>
                              <div className="w-full h-full flex flex-col items-center justify-center bg-blue-600/10 border border-blue-500/30 rounded-lg px-4 py-6 shadow-lg min-h-[180px]">
                                <Route className="h-10 w-10 text-blue-400 mb-3" />
                                <span className="text-base font-semibold text-blue-300">{t('architecture.assignmentTitle')}</span>
                                <span className="text-xs text-blue-400/80 mt-1 text-center px-2">{t('architecture.assignmentDesc')}</span>
                              </div>
                              <ArrowRight className="block lg:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                          </motion.div>
                          <div className="hidden lg:flex items-center pt-10"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                          {/* Layer 4 */}
                          <motion.div variants={fadeIn} className="flex flex-col items-center relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
                              <div className="text-indigo-400 font-semibold mb-3 text-xs tracking-widest">{t('architecture.layer4')}</div>
                              <div className="w-full h-full flex flex-col items-center justify-center bg-green-600/10 border border-green-500/30 rounded-lg px-4 py-6 shadow-lg min-h-[180px]">
                                <Server className="h-10 w-10 text-green-400 mb-3" />
                                <span className="text-base font-semibold text-green-300">{t('architecture.layer4Title')}</span>
                                <span className="text-xs text-green-400/80 mt-1 text-center px-2">{t('architecture.layer4Desc')}</span>
                              </div>
                              <ArrowRight className="block lg:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                          </motion.div>
                          <div className="hidden lg:flex items-center pt-10"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                          {/* Origin */}
                          <motion.div variants={fadeIn} className="flex flex-col items-center relative w-full max-w-xs sm:max-w-sm lg:max-w-none lg:flex-1">
                              <div className="text-indigo-400 font-semibold mb-3 text-xs tracking-widest">{t('architecture.origin')}</div>
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-600/10 border border-gray-500/30 rounded-lg px-4 py-6 shadow-lg min-h-[180px]">
                                <Cpu className="h-10 w-10 text-gray-400 mb-3" />
                                <span className="text-base font-semibold text-gray-300">{t('architecture.originTitle')}</span>
                                <span className="text-xs text-gray-400/80 mt-1 text-center px-2">{t('architecture.originDesc')}</span>
                              </div>
                          </motion.div>
                      </div>
                  </div>
              </motion.div>
              <motion.div
                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
                  className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16 md:mt-20">
                  <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer group">
                     <h3 className="text-xl font-semibold mb-2 text-purple-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Layers size={20} className="mr-2 group-hover:scale-110 transition-transform"/>{t('architecture.l7CardTitle')}</h3>
                     <p className="text-gray-400 text-sm leading-relaxed">{t('architecture.l7CardDesc')}</p>
                  </motion.div>
                  <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer group">
                    <h3 className="text-xl font-semibold mb-2 text-blue-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Route size={20} className="mr-2 group-hover:scale-110 transition-transform"/>{t('architecture.assignmentCardTitle')}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{t('architecture.assignmentCardDesc')}</p>
                  </motion.div>
                  <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-green-500/10 cursor-pointer group">
                    <h3 className="text-xl font-semibold mb-2 text-green-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Server size={20} className="mr-2 group-hover:scale-110 transition-transform"/>{t('architecture.l4CardTitle')}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{t('architecture.l4CardDesc')}</p>
                  </motion.div>
              </motion.div>
          </div>
        </section>

        {/* --- Caching System Section --- */}
         <section id="caching" className="py-20 md:py-28 bg-gray-900 px-4 overflow-hidden">
              <div className="container mx-auto text-center">
                  <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold mb-6 text-white">
                     {t('caching.title')}
                  </motion.h2>
                  <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-lg md:text-xl text-gray-400 mb-16 md:mb-20 max-w-3xl mx-auto leading-relaxed">
                    {t('caching.subtitle')}
                  </motion.p>
                   <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="relative max-w-5xl mx-auto pb-10">
                      <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-6 md:gap-8">
                           {/* Player */}
                           <motion.div variants={fadeIn} className="flex flex-col items-center w-full max-w-xs">
                               <div className="text-green-400 font-semibold mb-3 text-xs tracking-widest">{t('caching.player')}</div>
                               <div className="w-full flex flex-col items-center justify-center bg-green-600/10 border border-green-500/30 rounded-lg px-4 py-6 shadow-lg text-center min-h-[180px]">
                                <Users className="h-10 w-10 text-green-400 mb-3"/>
                                <span className="text-base font-semibold text-green-300">{t('caching.playerTitle')}</span>
                                <span className="text-xs text-green-400/80 mt-1">{t('caching.playerDesc')}</span>
                               </div>
                               <ArrowRight className="block md:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                           </motion.div>
                           <div className="hidden md:flex items-center"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                           {/* Cloudflare */}
                           <motion.div variants={fadeIn} className="flex flex-col items-center w-full max-w-xs">
                               <div className="text-orange-400 font-semibold mb-3 text-xs tracking-widest">{t('caching.cloudflare')}</div>
                               <div className="w-full flex flex-col items-center justify-center bg-orange-600/10 border border-orange-500/30 rounded-lg px-4 py-6 shadow-lg text-center min-h-[180px]">
                                <Cloud className="h-10 w-10 text-orange-400 mb-3"/>
                                <span className="text-base font-semibold text-orange-300">{t('caching.cloudflareTitle')}</span>
                                <span className="text-xs text-orange-400/80 mt-1">{t('caching.cloudflareDesc')}</span>
                               </div>
                               <ArrowRight className="block md:hidden h-8 w-8 text-white/50 mt-6 transform rotate-90" />
                           </motion.div>
                            <div className="hidden md:flex items-center"> <ArrowRight className="h-10 w-10 text-white/60" /> </div>
                            {/* Your Server */}
                            <motion.div variants={fadeIn} className="flex flex-col items-center w-full max-w-xs">
                               <div className="text-blue-400 font-semibold mb-3 text-xs tracking-widest">{t('caching.yourServer')}</div>
                               <div className="w-full flex flex-col items-center justify-center bg-blue-600/10 border border-blue-500/30 rounded-lg px-4 py-6 shadow-lg text-center min-h-[180px]">
                                <Cpu className="h-10 w-10 text-blue-400 mb-3"/>
                                <span className="text-base font-semibold text-blue-300">{t('caching.yourServerTitle')}</span>
                                <span className="text-xs text-blue-400/80 mt-1">{t('caching.yourServerDesc')}</span>
                               </div>
                           </motion.div>
                      </div>
                   </motion.div>
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16 md:mt-20">
                      <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer group">
                        <h3 className="text-xl font-semibold mb-2 text-orange-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Cloud size={20} className="mr-2 group-hover:scale-110 transition-transform"/>{t('caching.cdnCardTitle')}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{t('caching.cdnCardDesc')}</p>
                      </motion.div>
                       <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer group">
                         <h3 className="text-xl font-semibold mb-2 text-blue-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Zap size={20} className="mr-2 group-hover:scale-110 transition-transform"/>{t('caching.loadCardTitle')}</h3>
                         <p className="text-gray-400 text-sm leading-relaxed">{t('caching.loadCardDesc')}</p>
                       </motion.div>
                  </motion.div>
             </div>
          </section>

        {/* --- About Section --- */}
         <section id="about" className="py-20 md:py-28 bg-gradient-to-b from-gray-800/70 to-gray-900 px-4">
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="container mx-auto max-w-4xl text-center p-8 md:p-12 bg-gray-800/60 rounded-xl border border-white/10 shadow-lg relative overflow-hidden backdrop-blur-sm" >
                   <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-600/10 rounded-full filter blur-3xl opacity-50 z-[-1]"></div>
                   <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full filter blur-3xl opacity-50 z-[-1]"></div>
                  <div className="relative z-10">
                      <h2 className="text-4xl font-bold mb-8 text-white">{t('about.title')}</h2>
                      <p className="text-lg text-gray-300 mb-6 leading-relaxed">{t('about.paragraph')}</p>
                      <div className="mt-10 p-6 bg-gradient-to-r from-white/5 to-white/10 rounded-lg border border-white/15 transform transition-all duration-300 hover:shadow-lg hover:border-white/25">
                          <h3 className="text-xl font-semibold mb-4 text-white flex items-center justify-center"><ShieldCheck size={24} className="mr-2 text-green-400"/>{t('about.infraTitle')}</h3>
                            <div className="flex justify-center items-center relative h-10 mx-auto mb-4 opacity-80 hover:opacity-100 transition-opacity duration-300">
                              <Image
                                src="/ovhcloud.png"
                                alt="OVH Cloud Logo"
                                width={115}
                                height={28}
                                className="object-contain"
                                onError={memoizedHandleOvhImageError}
                                priority
                              />
                            </div>
                          <p className="text-base text-gray-300">
                            {/* Use Trans with the 'components' prop for HTML within translations */}
                            <Trans i18nKey="about.infraParagraph"
                               components={{ 0: <strong className="text-white" /> }}
                            />
                           </p>
                      </div>
                  </div>
              </motion.div>
          </section>

        {/* --- Contact/Call to Action Section --- */}
         <section id="contact" className="py-20 md:py-32 px-4 relative">
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-indigo-900/40 to-gray-900 opacity-95 z-0"></div>
            <div className="container mx-auto max-w-4xl relative z-10">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="text-center mb-12 md:mb-16" >
                 <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">{t('contact.title')}</h2>
                 <div className="w-28 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 shadow-xl p-8 md:p-12 transform transition-all duration-500 hover:border-white/25 hover:shadow-2xl hover:shadow-indigo-500/10" >
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                  <div className="text-center md:text-left max-w-xl">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{t('contact.ctaTitle')}</h3>
                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">{t('contact.ctaParagraph')}</p>
                    <ul className="space-y-3 mb-8 text-gray-300 text-left text-sm md:text-base list-none pl-0">
                       <li className="flex items-center"> <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /> {t('contact.feature1')} </li>
                       <li className="flex items-center"> <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /> {t('contact.feature2')} </li>
                       <li className="flex items-center"> <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /> {t('contact.feature3')} </li>
                    </ul>
                  </div>
                  <div className="w-full md:w-auto flex flex-col items-center flex-shrink-0 mt-4 md:mt-0">
                    <a href="#pricing"
                     className="w-full md:w-auto inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-10 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40 text-center text-base md:text-lg"
                    >
                    {t('contact.pricingButton')}
                    </a>
                    <span className="text-gray-400 text-sm mt-3">{t('contact.pricingHint')}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

        {/* --- Footer --- */}
        <footer className="bg-gray-900 pt-16 pb-8 px-4 border-t border-white/10">
               <div className="container mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-12 text-gray-400">
                      <div className="lg:col-span-2">
                          <div className="flex items-center space-x-3 mb-5">
                             <div className="relative h-9 w-9 rounded-md overflow-hidden">
                               <Image
                                 src="/blanc.png"
                                 alt={t('fallbackLogoAlt') || "FiveShield Logo"}
                                 fill
                                 sizes="36px"
                                 priority
                                 onError={memoizedHandleImageError}
                               />
                             </div>
                             <span className="text-xl font-bold text-white">{t('fiveshield')}</span>
                          </div>
                          <p className="text-sm mb-6 max-w-md leading-relaxed">{t('footer.tagline')}</p>
                           <div className="flex space-x-4">
                             <a href="https://discord.gg/zucpnTMzHt" target="_blank" rel="noopener noreferrer" aria-label={t('nav.discordAria')} className="text-gray-400 hover:text-indigo-400 transition-colors p-1">
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" className="h-6 w-6 fill-current"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
                             </a>
                           </div>
                      </div>
                      <div>
                          <h3 className="text-base font-semibold text-white mb-5 tracking-wide">{t('footer.quickLinks')}</h3>
                          <ul className="space-y-3 text-sm list-none pl-0">
                             <li><a href="#installation" className="hover:text-indigo-400 transition-colors">{t('nav.installation')}</a></li>
                             <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">{t('nav.pricing')}</a></li>
                             <li><a href="#architecture" className="hover:text-indigo-400 transition-colors">{t('nav.architecture')}</a></li>
                             <li><a href="#caching" className="hover:text-indigo-400 transition-colors">{t('nav.caching')}</a></li>
                             <li><a href="#about" className="hover:text-indigo-400 transition-colors">{t('nav.about')}</a></li>
                             <li><a href="#contact" className="hover:text-indigo-400 transition-colors">{t('nav.contact')}</a></li>
                          </ul>
                      </div>
                      <div>
                           <h3 className="text-base font-semibold text-white mb-5 tracking-wide">{t('footer.support')}</h3>
                           <p className="text-sm mb-4 leading-relaxed">{t('footer.supportText')}</p>
                          <a href="https://discord.gg/zucpnTMzHt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors group" >
                            {t('footer.joinDiscord')} <ExternalLink className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform"/>
                          </a>
                      </div>
                  </div>
                  <div className="pt-8 mt-8 border-t border-white/10 text-center sm:flex sm:justify-between sm:text-left">
                      <p className="text-xs text-gray-500">{t('footer.copyright', { year: CURRENT_YEAR })}</p>
                      <div className="mt-4 sm:mt-0 text-xs">
                        <a href="#" className="text-gray-500 hover:text-gray-400 mr-4">{t('footer.privacy')}</a>
                        <a href="#" className="text-gray-500 hover:text-gray-400">{t('footer.terms')}</a>
                      </div>
                  </div>
              </div>
          </footer>

      </div> {/* End of main container */}
    </Suspense> // End Suspense
  ); // End of return statement
} // End of HomePage component