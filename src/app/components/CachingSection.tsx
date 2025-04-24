'use client';

import React from 'react';
// Import Variants type from framer-motion
import { motion, Variants } from 'framer-motion';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Users, Cloud, Cpu, ArrowRight, Zap } from 'lucide-react';

// Remove custom AnimationVariant type

interface CachingSectionProps {
    t: TFunction;
    fadeIn: Variants; // Use Variants type
    staggerContainer: Variants; // Use Variants type
}

const CachingSection: React.FC<CachingSectionProps> = ({ t, fadeIn, staggerContainer }) => {
    return (
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
                                <Users className="h-10 w-10 text-green-400 mb-3" />
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
                                <Cloud className="h-10 w-10 text-orange-400 mb-3" />
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
                                <Cpu className="h-10 w-10 text-blue-400 mb-3" />
                                <span className="text-base font-semibold text-blue-300">{t('caching.yourServerTitle')}</span>
                                <span className="text-xs text-blue-400/80 mt-1">{t('caching.yourServerDesc')}</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16 md:mt-20">
                    <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer group">
                        <h3 className="text-xl font-semibold mb-2 text-orange-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Cloud size={20} className="mr-2 group-hover:scale-110 transition-transform" />{t('caching.cdnCardTitle')}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{t('caching.cdnCardDesc')}</p>
                    </motion.div>
                    <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer group">
                        <h3 className="text-xl font-semibold mb-2 text-blue-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Zap size={20} className="mr-2 group-hover:scale-110 transition-transform" />{t('caching.loadCardTitle')}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{t('caching.loadCardDesc')}</p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default React.memo(CachingSection);
