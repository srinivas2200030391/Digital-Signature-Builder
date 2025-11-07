'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { motion } from 'framer-motion';
import {
  FileSignature,
  Type,
  Upload,
  Lock,
  FileText,
  Shield,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: FileSignature,
    title: 'Draw Signatures',
    description: 'Create unique signatures using your mouse or touch screen with our intuitive canvas.',
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500"></div>
    ),
  },
  {
    icon: Type,
    title: 'Type Signatures',
    description: 'Type your name and convert it into a professional signature instantly.',
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500 to-pink-500"></div>
    ),
  },
  {
    icon: Upload,
    title: 'Upload Signatures',
    description: 'Upload existing signature images in PNG or JPEG format.',
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500"></div>
    ),
  },
  {
    icon: Lock,
    title: 'Cryptographic Security',
    description: 'Each signature gets a unique SHA-256 hash and RSA-2048 key pair for maximum security.',
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500 to-emerald-500"></div>
    ),
  },
  {
    icon: FileText,
    title: 'PDF Integration',
    description: 'Seamlessly embed signatures into PDF documents with metadata.',
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500 to-red-500"></div>
    ),
  },
  {
    icon: Shield,
    title: 'Tamper Detection',
    description: 'Any modifications to signed documents are immediately detectable.',
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-violet-500 to-purple-500"></div>
    ),
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Grid items animation
      gsap.from('.bento-item', {
        scrollTrigger: {
          trigger: '.bento-grid',
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Everything you need to create, manage, and verify digital signatures
          </motion.p>
        </div>

        <BentoGrid className="bento-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="bento-item"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BentoGridItem
                  title={feature.title}
                  description={feature.description}
                  header={feature.header}
                  icon={<Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                />
              </motion.div>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
}
