'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
      })
        .from(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.5'
        )
        .from(
          buttonsRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.4'
        );

      // Floating animation for background elements
      gsap.to('.floating-element', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: 0.3,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="floating-element absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="floating-element absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
        >
          Create Secure Digital
          <br />
          Signatures with Ease
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto"
        >
          Sign documents with cryptographic security, embed signatures in PDFs,
          and ensure authenticity with blockchain-level verification.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Get Started Free
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              100%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Secure</div>
          </div>
          <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              RSA-2048
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Encryption</div>
          </div>
          <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              SHA-256
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Hashing</div>
          </div>
        </div>
      </div>
    </div>
  );
}
