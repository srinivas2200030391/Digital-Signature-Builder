'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignatureCanvasWithAuth from '@/components/SignatureCanvasWithAuth';
import SignaturePreview from '@/components/SignaturePreview';
import SavedSignatures from '@/components/SavedSignatures';
import MyDocuments from '@/components/MyDocuments';
import UserProfile from '@/components/UserProfile';
import Sidebar from '@/components/Sidebar';
import { SignatureMetadata } from '@/lib/pdfProcessor';
import { GridBackground } from '@/components/ui/grid-background';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ViewType = 'dashboard' | 'signature' | 'documents' | 'profile' | 'settings' | 'verify';

export default function Home() {
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureMetadata, setSignatureMetadata] = useState<SignatureMetadata | null>(null);
  const [personalDetails, setPersonalDetails] = useState<any>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page if not authenticated
    if (!isAuthenticated) {
      router.push('/landing');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Handle hash changes for navigation
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ViewType;
      const validViews: ViewType[] = ['dashboard', 'signature', 'documents', 'profile', 'settings', 'verify'];
      
      if (hash && validViews.includes(hash)) {
        setActiveView(hash);
      } else {
        setActiveView('dashboard');
      }
    };

    // Set initial view
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);



  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  const renderView = () => {
    switch (activeView) {
      case 'signature':
        return (
          <div className="space-y-6">
            <motion.div
              className="dashboard-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="dashboard-card"
            >
              <SavedSignatures />
            </motion.div>
          </div>
        );

      case 'documents':
        return (
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MyDocuments
              signatureData={signatureData}
              signatureMetadata={signatureMetadata}
              personalDetails={personalDetails}
            />
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <UserProfile />
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-xl backdrop-blur-sm bg-card/95">
              <CardHeader>
                <CardTitle className="text-2xl">Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'verify':
        return (
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-xl backdrop-blur-sm bg-card/95">
              <CardHeader>
                <CardTitle className="text-2xl">Verify Signature</CardTitle>
                <CardDescription>Verify the authenticity of signed documents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Signature verification feature coming soon...</p>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        // Dashboard view
        return (
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

            {/* Right Column - Quick Links */}
            <div className="space-y-6">
              <motion.div
                className="dashboard-card"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="shadow-xl backdrop-blur-sm bg-card/95">
                  <CardHeader>
                    <CardTitle className="text-2xl">Quick Actions</CardTitle>
                    <CardDescription>Access your most used features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <a
                      href="#documents"
                      className="block p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-lg mb-2">📄 My Documents</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload, manage, and sign your PDF documents
                      </p>
                    </a>
                    <a
                      href="#profile"
                      className="block p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-lg mb-2">👤 My Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        View and manage your account information
                      </p>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        );
    }
  };

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

            {renderView()}

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
