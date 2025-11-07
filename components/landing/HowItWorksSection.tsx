'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Create Your Signature',
    description: 'Choose from drawing, typing, or uploading your signature.',
  },
  {
    number: '02',
    title: 'Save Securely',
    description: 'Your signature is hashed and encrypted with RSA-2048 keys.',
  },
  {
    number: '03',
    title: 'Upload Document',
    description: 'Select the PDF document you want to sign.',
  },
  {
    number: '04',
    title: 'Sign & Download',
    description: 'Embed your signature and download the signed document.',
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step, index) => {
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: 'top bottom-=50',
            end: 'top center',
            toggleActions: 'play none none reverse',
          },
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });

        // Animate the number on scroll
        const numberEl = step.querySelector('.step-number');
        if (numberEl) {
          gsap.from(numberEl, {
            scrollTrigger: {
              trigger: step,
              start: 'top bottom-=100',
            },
            scale: 0.5,
            rotation: -180,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.7)',
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Four simple steps to create and embed your digital signature
          </motion.p>
        </div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) stepsRef.current[index] = el;
              }}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 text-center md:text-left">
                <div className="step-number text-6xl font-bold text-blue-600/20 mb-4">{step.number}</div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-full h-64 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow">
                  <span className="text-8xl">{step.number}</span>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
