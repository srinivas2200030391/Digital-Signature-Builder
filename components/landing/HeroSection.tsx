'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { Spotlight } from '@/components/ui/spotlight';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation for background elements
      gsap.to('.floating-element', {
        y: -30,
        x: 20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.5,
          from: 'random',
        },
      });

      // Stats animation
      if (statsRef.current) {
        gsap.from('.stat-card', {
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
        });
      }

      // Buttons entrance animation
      if (buttonsRef.current) {
        gsap.from('.cta-button', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.5,
          stagger: 0.2,
          ease: 'back.out(1.7)',
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const words = "Sign documents with cryptographic security, embed signatures in PDFs, and ensure authenticity with blockchain-level verification.";

  return (
    <div ref={heroRef} className="relative">
      <HeroHighlight containerClassName="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        {/* Spotlight Effect */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-20 left-10 w-64 h-64 bg-blue-500/20 dark:bg-blue-400/10 rounded-full blur-3xl" />
          <div className="floating-element absolute top-40 right-20 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="floating-element absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 dark:bg-purple-400/10 rounded-full blur-3xl" />
          <div className="floating-element absolute top-1/2 right-1/4 w-72 h-72 bg-pink-500/20 dark:bg-pink-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
          >
            Create Secure{' '}
            <Highlight className="text-black dark:text-white">
              Digital Signatures
            </Highlight>
            <br />
            with Ease
          </motion.h1>

          <div className="max-w-3xl mx-auto mb-10">
            <TextGenerateEffect words={words} className="text-xl sm:text-2xl" />
          </div>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup" className="cta-button">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Get Started Free
                </Button>
              </motion.div>
            </Link>
            <Link href="#features" className="cta-button">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Learn More
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="stat-card p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                100%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Secure</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="stat-card p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                RSA-2048
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Encryption</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="stat-card p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                SHA-256
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Hashing</div>
            </motion.div>
          </div>
        </div>
      </HeroHighlight>
    </div>
  );
}
