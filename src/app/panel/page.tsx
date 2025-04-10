'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Image from 'next/image';
import { motion } from 'framer-motion';
import '../../i18n';
import { 
  Shield, Users, Server, Lock, LogIn, ExternalLink, 
  User, KeyRound, ArrowRight, ChevronLeft, X, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function PanelPage() {
  const { t, i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showGetStartedView, setShowGetStartedView] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const searchParams = useSearchParams();
  
  // Set isClient to true when component mounts and check for source parameter
  useEffect(() => {
    setIsClient(true);
    document.documentElement.lang = i18n.language;
    
    // Check if user came from "Get Started" button
    const source = searchParams.get('source');
    if (source === 'getstarted') {
      setShowGetStartedView(true);
      setShowWelcomeBanner(true);
    }
  }, [i18n.language, searchParams]);

  const handleDiscordAuth = (isSignup = false) => {
    setIsAuthenticating(true);
    
    // Using a real Discord application client ID
    const clientId = '1359948815297413405'; // FiveShield Discord application ID
    
    // Define callback endpoint that will receive and process user identity
    const redirectUri = encodeURIComponent('https://panel.fiveshield.co/auth/discord/callback');
    
    // Request sufficient scopes to identify users uniquely
    // - identify: Get user's Discord ID, username, avatar, etc.
    // - email: Get user's email for account association
    // - guilds: Optional - Check which servers they're in (useful for admin verification)
    const scope = encodeURIComponent('identify email guilds');
    
    // Generate a unique state to prevent CSRF
    const uniqueState = `${isSignup ? 'signup' : 'login'}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Store state in sessionStorage to verify when the user returns
    sessionStorage.setItem('discordAuthState', uniqueState);
    
    // Use user's language preference as locale hint if available
    const locale = i18n.language || 'en';
    
    // Redirect to Discord OAuth authorization
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${uniqueState}&prompt=consent&locale=${locale}`;
    
    // On callback, we'll:
    // 1. Verify the state parameter to prevent CSRF
    // 2. Exchange the code for an access token
    // 3. Use the token to fetch the user's Discord profile (including ID, username, avatar)
    // 4. Check if the user exists in our database, create if not
    // 5. Create a session for the authenticated user
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = `https://placehold.co/${target.width || 40}x${target.height || 40}/FFFFFF/1F2937?text=FS`;
    target.alt = t('fallbackLogoAlt') || "FiveShield Logo";
  };

  if (!isClient) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 text-white text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 text-white text-xl font-semibold">
        Loading...
      </div>
    }>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/40 text-white font-sans">
        {/* Header/Navigation */}
        <header className="px-4 py-6 border-b border-white/10">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative h-10 w-10 rounded-md overflow-hidden">
                <Image
                  src="/blanc.png"
                  alt={t('fallbackLogoAlt') || "FiveShield Logo"}
                  className="transition-transform duration-300 group-hover:scale-110"
                  fill
                  sizes="40px"
                  priority
                  onError={handleImageError}
                />
              </div>
              <span className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-indigo-400">
                {t('fiveshield')} <span className="text-indigo-400">Panel</span>
              </span>
            </Link>
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white transition-colors flex items-center text-sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('panel.backToMainSite') || "Back to main site"}
            </Link>
          </div>
        </header>

        {/* Welcome Banner for users coming from Get Started */}
        {showWelcomeBanner && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 border-b border-indigo-500/50"
          >
            <div className="container mx-auto py-3 px-4 flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                <p className="text-white text-sm">
                  {t('panel.welcomeBanner') || "Welcome! You're just a few steps away from protecting your FiveM server."}
                </p>
              </div>
              <button 
                onClick={() => setShowWelcomeBanner(false)}
                className="text-white/80 hover:text-white"
                aria-label="Close banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Main content */}
        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Column - Panel Info */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.h1 
                variants={fadeIn}
                className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-indigo-400"
              >
                {showGetStartedView 
                  ? (t('panel.getStartedTitle') || "Get Started with FiveShield")
                  : (t('panel.title') || "FiveShield Control Panel")}
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                className="text-lg text-gray-300 leading-relaxed mb-6"
              >
                {showGetStartedView
                  ? (t('panel.getStartedDescription') || "Complete your account setup to start protecting your FiveM server from attacks and enjoy optimized performance for your players.")
                  : (t('panel.description') || "Manage your FiveRP server protection settings, view statistics, and configure your security preferences in one central dashboard.")}
              </motion.p>

              <motion.div variants={fadeIn} className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('panel.featureProtection') || "Advanced Protection"}</h3>
                    <p className="text-sm text-gray-400">{t('panel.featureProtectionDesc') || "Configure your server's DDoS protection settings and security policies."}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Server className="h-6 w-6 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('panel.featureMonitoring') || "Real-time Monitoring"}</h3>
                    <p className="text-sm text-gray-400">{t('panel.featureMonitoringDesc') || "View real-time metrics about your protection status and traffic patterns."}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('panel.featureManagement') || "User Management"}</h3>
                    <p className="text-sm text-gray-400">{t('panel.featureManagementDesc') || "Manage team access and permissions to your FiveShield dashboard."}</p>
                  </div>
                </div>
              </motion.div>

              {/* Steps indicator for Get Started flow */}
              {showGetStartedView && (
                <motion.div 
                  variants={fadeIn}
                  className="mt-6 p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/30"
                >
                  <h4 className="font-medium text-indigo-300 mb-3">{t('panel.getStartedSteps') || "Complete these steps to get started:"}</h4>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="bg-indigo-500 text-white w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs">1</span>
                      <span>{t('panel.step1') || "Create your account"}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-gray-700 text-gray-300 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs">2</span>
                      <span className="text-gray-400">{t('panel.step2') || "Configure your server details"}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-gray-700 text-gray-300 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs">3</span>
                      <span className="text-gray-400">{t('panel.step3') || "Set up protection options"}</span>
                    </li>
                  </ol>
                </motion.div>
              )}
            </motion.div>

            {/* Right Column - Login/Signup Form */}
            <div className="bg-gray-800/50 rounded-xl border border-white/10 p-6 md:p-8 shadow-xl backdrop-blur-sm">
              {showGetStartedView ? (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-center text-white">{t('panel.createAccount') || "Create Your Account"}</h2>
                  
                  <div className="space-y-4">
                    <p className="text-center text-gray-300 mb-4">
                      {t('panel.discordSignupDesc') || "Connect with Discord to quickly create your FiveShield account and manage your servers."}
                    </p>
                    
                    <button
                      onClick={() => handleDiscordAuth(true)}
                      disabled={isAuthenticating}
                      className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                        <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                      </svg>
                      {isAuthenticating 
                        ? (t('panel.connecting') || "Connecting...") 
                        : (t('panel.signupWithDiscord') || "Sign up with Discord")}
                    </button>
                    
                    <div className="flex items-center">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                        {t('panel.agreeToTerms') || "I agree to the Terms of Service and Privacy Policy"}
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center text-sm text-gray-400">
                    <p>
                      {t('panel.alreadyHaveAccount') || "Already have an account?"}{' '}
                      <button 
                        onClick={() => setShowGetStartedView(false)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {t('panel.signIn') || "Sign In"}
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-center text-white">{t('panel.loginTitle') || "Access Your Dashboard"}</h2>
                  
                  <div className="space-y-4">
                    <p className="text-center text-gray-300 mb-4">
                      {t('panel.discordLoginDesc') || "Log in with your Discord account to access your FiveShield dashboard."}
                    </p>
                    
                    <button
                      onClick={() => handleDiscordAuth(false)}
                      disabled={isAuthenticating}
                      className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                        <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                      </svg>
                      {isAuthenticating 
                        ? (t('panel.connecting') || "Connecting...") 
                        : (t('panel.loginWithDiscord') || "Continue with Discord")}
                    </button>
                  </div>
                  
                  <div className="mt-6 text-center text-sm text-gray-400">
                    <p>
                      {t('panel.noAccount') || "Don't have an account?"}{' '}
                      <button 
                        onClick={() => setShowGetStartedView(true)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {t('panel.getStarted') || "Get Started"}
                      </button>
                    </p>
                  </div>
                </>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
                <p className="text-xs text-gray-500">
                  {t('panel.needHelp') || "Need help getting set up?"}{' '}
                  <a 
                    href="https://discord.gg/zucpnTMzHt" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {t('panel.contactUs') || "Contact us on Discord"}
                    <ExternalLink className="inline-block h-3 w-3 ml-1" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-white/10">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} FiveShield - {t('panel.footerRights') || "All rights reserved."}</p>
            <p className="mt-2">
              <a href="#" className="text-gray-500 hover:text-gray-400 mx-2">{t('panel.termsOfService') || "Terms of Service"}</a>
              <a href="#" className="text-gray-500 hover:text-gray-400 mx-2">{t('panel.privacyPolicy') || "Privacy Policy"}</a>
            </p>
          </div>
        </footer>
      </div>
    </Suspense>
  );
}
