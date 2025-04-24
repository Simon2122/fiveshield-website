'use client';

import React from 'react';
// Import Variants type from framer-motion
import { motion, Variants } from 'framer-motion';
import { TFunction } from 'i18next';
import { CheckCircle2 } from 'lucide-react';

// Remove custom AnimationVariant type

interface ContactSectionProps {
    t: TFunction;
    fadeIn: Variants;
    staggerContainer: Variants;
}

// Keep unused props (fadeIn, staggerContainer) removed from the function signature
const ContactSection: React.FC<ContactSectionProps> = ({ t }) => {
    return (
        <section id="contact" className="py-20 md:py-32 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-indigo-900/40 to-gray-900 opacity-95 z-0"></div>
            <div className="container mx-auto max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">{t('contact.title')}</h2>
                    <div className="w-28 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 shadow-xl p-8 md:p-12 transform transition-all duration-500 hover:border-white/25 hover:shadow-2xl hover:shadow-indigo-500/10"
                >
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
    );
};

export default React.memo(ContactSection);
