'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TFunction } from 'i18next';

import { Trans } from 'react-i18next';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

interface AboutSectionProps {
    t: TFunction;
    fadeIn: any;
    staggerContainer: any; // Not used directly here but kept for consistency if needed later
    memoizedHandleOvhImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ t, fadeIn, memoizedHandleOvhImageError }) => {
    // Use fadeIn directly on the main container if stagger isn't needed inside
    return (
        <section id="about" className="py-20 md:py-28 bg-gradient-to-b from-gray-800/70 to-gray-900 px-4">
            <motion.div
                initial="hidden" // Use initial="hidden" and whileInView="visible" for consistency
                whileInView="visible"
                variants={fadeIn} // Apply fadeIn directly
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }} // Adjust transition if needed
                className="container mx-auto max-w-4xl text-center p-8 md:p-12 bg-gray-800/60 rounded-xl border border-white/10 shadow-lg relative overflow-hidden backdrop-blur-sm"
            >
                <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-600/10 rounded-full filter blur-3xl opacity-50 z-[-1]"></div>
                <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full filter blur-3xl opacity-50 z-[-1]"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold mb-8 text-white">{t('about.title')}</h2>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">{t('about.paragraph')}</p>
                    <div className="mt-10 p-6 bg-gradient-to-r from-white/5 to-white/10 rounded-lg border border-white/15 transform transition-all duration-300 hover:shadow-lg hover:border-white/25">
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center justify-center"><ShieldCheck size={24} className="mr-2 text-green-400" />{t('about.infraTitle')}</h3>
                        <div className="flex justify-center items-center relative h-10 mx-auto mb-4 opacity-80 hover:opacity-100 transition-opacity duration-300">
                            <Image
                                src="/ovhcloud.png"
                                alt="OVH Cloud Logo"
                                width={115}
                                height={28}
                                className="object-contain"
                                onError={memoizedHandleOvhImageError}
                                priority // Consider if this is truly priority or if lazy loading is better
                            />
                        </div>
                        <p className="text-base text-gray-300">
                            <Trans i18nKey="about.infraParagraph"
                                components={{ 0: <strong className="text-white" /> }}
                            />
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default React.memo(AboutSection);
