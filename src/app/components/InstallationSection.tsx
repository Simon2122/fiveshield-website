'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TFunction } from 'i18next';
import { Trans } from 'react-i18next';
import { Users, Settings, ShieldCheck } from 'lucide-react';

// Define props type including animation variants
interface InstallationSectionProps {
    t: TFunction;
    fadeIn: any; // Consider defining a more specific type if available
    staggerContainer: any; // Consider defining a more specific type if available
}

const InstallationSection: React.FC<InstallationSectionProps> = ({ t, fadeIn, staggerContainer }) => {
    return (
        <section id="installation" className="py-20 md:py-28 bg-gray-900 px-4">
            <div className="container mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-16 text-white"
                >
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
    );
};

export default React.memo(InstallationSection);
