'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignatureCanvasWithAuth from '@/components/SignatureCanvasWithAuth';
import DocumentUpload from '@/components/DocumentUpload';
import SignaturePreview from '@/components/SignaturePreview';
import SavedSignatures from '@/components/SavedSignatures';
import Sidebar from '@/components/Sidebar';
import { SignatureMetadata } from '@/lib/pdfProcessor';
import { GridBackground } from '@/components/ui/grid-background';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

export default function Home() {
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureMetadata, setSignatureMetadata] = useState<SignatureMetadata | null>(null);
  const [personalDetails, setPersonalDetails] = useState<any>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page if not authenticated
    if (!isAuthenticated) {
      router.push('/landing');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Add entrance animations
    gsap.from('.dashboard-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 0.3,
    });
  }, []);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <GridBackground className="flex-1 overflow-auto">
        <main className="relative min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex flex-col space-y-4">
                <div>
                  <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4">
                    Digital Signature Builder
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Create secure digital signatures with cryptographic keys and embed them into your documents
                  </p>
                </div>
              </div>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Signature Creation */}
              <div className="space-y-6">
                <motion.div
                  className="dashboard-card"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <SignatureCanvasWithAuth
                    onSignatureComplete={(data, metadata, personal) => {
                      setSignatureData(data);
                      setSignatureMetadata(metadata);
                      setPersonalDetails(personal);
                    }}
                  />
                </motion.div>
                
                {signatureData && signatureMetadata && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="dashboard-card"
                  >
                    <SignaturePreview
                      signatureData={signatureData}
                      metadata={signatureMetadata}
                    />
                  </motion.div>
                )}

                {/* Saved Signatures */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="dashboard-card"
                >
                  <SavedSignatures />
                </motion.div>
              </div>

              {/* Right Column - Document Upload and Processing */}
              <div className="space-y-6">
                <motion.div
                  className="dashboard-card"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <DocumentUpload
                    onDocumentUpload={setDocumentFile}
                    signatureData={signatureData}
                    signatureMetadata={signatureMetadata}
                    personalDetails={personalDetails}
                  />
                </motion.div>
              </div>
            </div>

            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-16 text-center text-muted-foreground"
            >
              <p className="text-sm">
                Secure • Encrypted • Verifiable
              </p>
            </motion.footer>
          </div>
        </main>
      </GridBackground>
    </div>
  );
}
