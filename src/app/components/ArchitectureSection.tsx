'use client';

import React from 'react';
// Import Variants type from framer-motion
import { motion, Variants } from 'framer-motion';
import { TFunction } from 'i18next';
import { Layers, Route, Server, Cpu, ArrowRight } from 'lucide-react';

// Remove custom AnimationVariant type

interface ArchitectureSectionProps {
    t: TFunction;
    fadeIn: Variants; // Use Variants type
    staggerContainer: Variants; // Use Variants type
}

const ArchitectureSection: React.FC<ArchitectureSectionProps> = ({ t, fadeIn, staggerContainer }) => {
    return (
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
                        <h3 className="text-xl font-semibold mb-2 text-purple-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Layers size={20} className="mr-2 group-hover:scale-110 transition-transform" />{t('architecture.l7CardTitle')}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{t('architecture.l7CardDesc')}</p>
                    </motion.div>
                    <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer group">
                        <h3 className="text-xl font-semibold mb-2 text-blue-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Route size={20} className="mr-2 group-hover:scale-110 transition-transform" />{t('architecture.assignmentCardTitle')}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{t('architecture.assignmentCardDesc')}</p>
                    </motion.div>
                    <motion.div variants={fadeIn} className="p-6 bg-gray-800/50 rounded-lg border border-white/10 hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-green-500/10 cursor-pointer group">
                        <h3 className="text-xl font-semibold mb-2 text-green-400 flex items-center group-hover:translate-x-0.5 transition-transform"><Server size={20} className="mr-2 group-hover:scale-110 transition-transform" />{t('architecture.l4CardTitle')}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{t('architecture.l4CardDesc')}</p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default React.memo(ArchitectureSection);
