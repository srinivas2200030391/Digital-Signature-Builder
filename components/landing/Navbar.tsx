'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Entrance animation for navbar items
    gsap.from(linksRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.2,
    });
  }, []);

  const handleLinkHover = (index: number) => {
    const link = linksRef.current[index];
    if (link) {
      gsap.to(link, {
        y: -2,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleLinkLeave = (index: number) => {
    const link = linksRef.current[index];
    if (link) {
      gsap.to(link, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/landing" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">DS</span>
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Digital Signature
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a
              ref={(el) => {
                linksRef.current[0] = el;
              }}
              href="/landing#features"
              onMouseEnter={() => handleLinkHover(0)}
              onMouseLeave={() => handleLinkLeave(0)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              Features
            </a>
            <a
              ref={(el) => {
                linksRef.current[1] = el;
              }}
              href="/landing#how-it-works"
              onMouseEnter={() => handleLinkHover(1)}
              onMouseLeave={() => handleLinkLeave(1)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              How It Works
            </a>
            <a
              ref={(el) => {
                linksRef.current[2] = el;
              }}
              href="/landing#security"
              onMouseEnter={() => handleLinkHover(2)}
              onMouseLeave={() => handleLinkLeave(2)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              Security
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline">Dashboard</Button>
                  </motion.div>
                </Link>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.name}
                </span>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={logout} variant="ghost">
                    Logout
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost">Sign In</Button>
                  </motion.div>
                </Link>
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button>Get Started</Button>
                  </motion.div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
