'use client';

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import with no SSR for the globe visualization
const GlobeVisualization = dynamic(
  () => import('./GlobeVisualization'),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-gray-900/5" /> }
);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Hero() {
  const { t } = useTranslation();

  return (
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
  );
}
