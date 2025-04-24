// src/app/page.tsx
'use client'; // Must be at the top

// Optimize i18n import to use the enhanced initialization
import { initI18n } from '../i18n';
initI18n(); // Explicitly initialize once before component renders

// Remove 'lazy' from the react import
import React, { useState, useEffect, Suspense, useCallback } from 'react';
// Remove Head import: import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Menu, X, ExternalLink,
} from 'lucide-react';

import Hero from './components/Hero';
import PricingCalculator from './components/PricingCalculator';
import InstallationSection from './components/InstallationSection';
import ArchitectureSection from './components/ArchitectureSection';
import CachingSection from './components/CachingSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';


// --- Constants --- (Keep outside)
const CURRENT_YEAR = new Date().getFullYear();

// --- Animation Variants --- (Keep outside, pass as props)
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};


export default function HomePage() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const changeLanguage = useCallback((lng: 'en' | 'fr') => {
    i18n.changeLanguage(lng);
    setMobileMenuOpen(false);
  }, [i18n]);

  useEffect(() => {
    setIsClient(true);
    // Memory cleanup in development
    if (process.env.NODE_ENV === 'development') {
      return () => {
        // Cleanup logic if needed
      };
    }
  }, []);

  useEffect(() => {
    if (isClient && currentLanguage) {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage, isClient]);

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const memoizedHandleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Set fallback src first
    target.src = `https://placehold.co/${target.width || 40}x${target.height || 40}/FFFFFF/1F2937?text=FS`;
    target.alt = t('fallbackLogoAlt');
    // Then remove the handler to prevent loops if the fallback also fails
    target.onerror = null;
  }, [t]);

  const memoizedHandleOvhImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Hide the image first
    target.style.display = 'none';
    // Then remove the handler
    target.onerror = null;
  }, []);

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

  return (
    <Suspense fallback={renderLoader()}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/40 text-white font-sans overflow-x-hidden">

        {/* --- Navigation Bar --- */}
        <nav className="sticky top-0 z-50 bg-gray-900/70 backdrop-blur-lg p-4 border-b border-white/10 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo */}
            <a href="#" className="flex items-center space-x-2 group flex-shrink-0">
              <div className="relative h-10 w-10 rounded-md overflow-hidden">
                <Image
                  src="/blanc.png"
                  alt={t('fallbackLogoAlt') || "FiveShield Logo"}
                  className="transition-transform duration-300 group-hover:scale-110"
                  fill
                  sizes="40px"
                  priority
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
                <span className="absolute left-0 -bottom-0.5 w-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#about" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
                {t('nav.about')}
                <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#contact" className="hover:text-indigo-400 transition-colors duration-300 relative group py-1">
                {t('nav.contact')}
                <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* Desktop Right Side */}
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
        <Hero />

        {/* --- How It Works Section --- */}
        <InstallationSection t={t} fadeIn={fadeIn} staggerContainer={staggerContainer} />

        {/* --- Pricing Section --- */}
        <PricingCalculator/>

        {/* --- Protection Architecture Section --- */}
        <ArchitectureSection t={t} fadeIn={fadeIn} staggerContainer={staggerContainer} />

        {/* --- Caching System Section --- */}
        <CachingSection t={t} fadeIn={fadeIn} staggerContainer={staggerContainer} />

        {/* --- About Section --- */}
        <AboutSection t={t} fadeIn={fadeIn} staggerContainer={staggerContainer} memoizedHandleOvhImageError={memoizedHandleOvhImageError} />

        {/* --- Contact/Call to Action Section --- */}
        <ContactSection t={t} fadeIn={fadeIn} staggerContainer={staggerContainer} />

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
  );
}