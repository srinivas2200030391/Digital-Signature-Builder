'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Lock, Shield, Key, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const securityFeatures = [
  {
    icon: Lock,
    title: 'SHA-256 Hashing',
    description: 'Each signature is converted to a unique cryptographic hash that ensures integrity.',
  },
  {
    icon: Key,
    title: 'RSA-2048 Encryption',
    description: 'Industry-standard encryption with public and private key pairs for verification.',
  },
  {
    icon: Shield,
    title: 'Unique Signature Detection',
    description: 'Our database ensures no two users can use the same signature.',
  },
  {
    icon: CheckCircle2,
    title: 'Tamper-Proof Documents',
    description: 'Any modification to signed documents is immediately detectable through hash verification.',
  },
];

export default function SecuritySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Set initial state to ensure visibility
    gsap.set('.security-card', { scale: 1, opacity: 1 });
    
    const ctx = gsap.context(() => {
      gsap.from('.security-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom center',
          toggleActions: 'play none none none',
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardHover = (index: number, isEntering: boolean) => {
    const card = cardsRef.current[index];
    if (card) {
      const icon = card.querySelector('.security-icon');
      if (icon) {
        gsap.to(icon, {
          rotation: isEntering ? 360 : 0,
          scale: isEntering ? 1.2 : 1,
          duration: 0.5,
          ease: isEntering ? 'back.out(1.7)' : 'power2.out',
        });
      }
    }
  };

  return (
    <section id="security" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            Bank-Level Security
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Your signatures are protected with the same cryptography used by financial institutions
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
                whileHover={{ y: -5 }}
                className="security-card p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent hover:border-blue-500 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="security-icon w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
