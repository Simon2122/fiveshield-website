'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Zap, Globe, Check, Shield, ExternalLink } from 'lucide-react';

// --- Constants --- (Passed as props or defined here if static)
const MIN_PLAYERS = 20;
const MAX_PLAYERS = 2048;

// --- Pricing Logic Functions --- (Can be passed as props or defined here)
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

// --- Animation Variants ---
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};


export default function PricingCalculator() {
  const { t } = useTranslation();

  // --- State for immediate slider/input feedback ---
  const [immediatePlayerCount, setImmediatePlayerCount] = useState(50);

  // --- Memos & Callbacks ---
  const servicePricePerMonth = useMemo(() => calculateServicePricePerDay(immediatePlayerCount) * 30, [immediatePlayerCount]);
  const dedicatedPricePerMonth = useMemo(() => calculateDedicatedProxyPricePerHour(immediatePlayerCount) * 24 * 30, [immediatePlayerCount]);

  const handlePlayerCountChange = useCallback((value: number | string) => {
      let num = typeof value === 'string' ? parseInt(value, 10) : value;
      if (isNaN(num)) num = MIN_PLAYERS;
      const clampedValue = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, num));
      setImmediatePlayerCount(clampedValue);
  }, []);

  const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      handlePlayerCountChange(parseInt(event.target.value, 10));
  }, [handlePlayerCountChange]);

  const sliderPercentage = useMemo(() => {
      const range = MAX_PLAYERS - MIN_PLAYERS;
      const valueInRange = immediatePlayerCount - MIN_PLAYERS;
      if (range === 0) return 0;
      return (valueInRange / range) * 100;
  }, [immediatePlayerCount]);

  return (
    <motion.section
      id="pricing"
      className="py-20 md:py-28 px-4 bg-gray-900 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={staggerContainer}
    >
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 mb-12 md:mb-16 text-center">
        <motion.div variants={fadeIn} className="inline-block relative">
          <h2 className="tracking-tight inline from-indigo-400 to-purple-400 text-[2.3rem] lg:text-5xl leading-tight font-black bg-clip-text text-transparent bg-gradient-to-b">
             {t('pricing.title')}
          </h2>
          <p className="z-10 relative text-gray-400 mt-2">
             {t('pricing.subtitle')}
          </p>
        </motion.div>
      </div>

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
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-200 font-medium text-sm">{t('pricing.playerPeakLabel')}</span>
                  <div className="flex items-center gap-1">
                    <input
                      className="text-white font-bold bg-indigo-500/20 px-2 py-1 rounded-lg w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border border-transparent focus:border-indigo-400 focus:ring-indigo-400 focus:ring-1 focus:outline-none transition"
                      min={MIN_PLAYERS}
                      max={MAX_PLAYERS}
                      type="number"
                      value={immediatePlayerCount}
                      onChange={(e) => handlePlayerCountChange(e.target.value)}
                    />
                    <span className="text-xs text-gray-400">{t('pricing.playersUnit')}</span>
                  </div>
                </div>
                <div className="relative flex items-center w-full h-5 mb-1 cursor-pointer group">
                   <input
                      type="range"
                      min={MIN_PLAYERS}
                      max={MAX_PLAYERS}
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
                        style={{ width: `max(0.5rem, min(calc(${sliderPercentage}% + ${5 - sliderPercentage * 0.1}px), calc(100% - 0.5rem)))` }}
                    ></div>
                </div>
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
                <div className="md:w-1/4 flex-shrink-0">
                  <div className="flex items-baseline mb-1">
                    <span className="text-xl font-bold">{servicePricePerMonth.toFixed(1)}$ USD</span>
                    <span className="ml-1 text-xs text-gray-400">{t('pricing.monthlySuffix')}</span>
                  </div>
                  <p className="text-xs text-gray-500">{t('pricing.dailyCalculation', { price: calculateServicePricePerDay(immediatePlayerCount).toFixed(1) })}</p>
                </div>
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
                <span className="text-2xl font-bold">{dedicatedPricePerMonth.toFixed(1)}$ USD</span>
                <span className="text-gray-300 ml-1 text-xs">{t('pricing.monthlySuffix')}</span>
                <div className="mt-1 flex items-center">
                <div className="bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300 text-xs mr-2">{t('pricing.bestPerformance')}</div>
                <p className="text-xs text-gray-300">{t('pricing.noCommitment')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-800/40 p-3 rounded-lg flex items-start"> 
                  <Zap className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 flex-shrink-0"/> 
                  <div> 
                    <p className="text-xs font-medium text-gray-200">{t('pricing.proxyPricingLabel')}</p>
                    <p className="text-xs text-gray-300">
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
                <div className="text-center md:text-left flex-grow">
                  <p className="text-sm text-gray-300">
                    {t('pricing.estimatedBilling')}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 mt-3 md:mt-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0">{t('pricing.totalPriceLabel')}</p>
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
  );
}
