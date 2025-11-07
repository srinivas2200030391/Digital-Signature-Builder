'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-xl">DS</span>
              </motion.div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300">Digital Signature Builder</span>
            </div>
            <p className="text-gray-300 mb-4">
              Create secure digital signatures with cryptographic keys and embed them into your documents with confidence.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, y: -3 }}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, y: -3 }}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, y: -3 }}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, y: -3 }}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-6 h-6" />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-300">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/landing#features" className="text-gray-300 hover:text-white transition-colors hover:underline">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/landing#how-it-works" className="text-gray-300 hover:text-white transition-colors hover:underline">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/landing#security" className="text-gray-300 hover:text-white transition-colors hover:underline">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-300">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/signup" className="text-gray-300 hover:text-white transition-colors hover:underline">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors hover:underline">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors hover:underline">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              © 2024 Digital Signature Builder. All rights reserved. • Secure • Encrypted • Verifiable
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm hover:underline">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
