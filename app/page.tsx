'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignatureCanvasWithAuth from '@/components/SignatureCanvasWithAuth';
import DocumentUpload from '@/components/DocumentUpload';
import SignaturePreview from '@/components/SignaturePreview';
import { SignatureMetadata } from '@/lib/pdfProcessor';
import { GridBackground } from '@/components/ui/grid-background';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureMetadata, setSignatureMetadata] = useState<SignatureMetadata | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page if not authenticated
    if (!isAuthenticated) {
      router.push('/landing');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <GridBackground className="min-h-screen">
      <main className="relative min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4">
                  Digital Signature Builder
                </h1>
                <p className="text-lg text-muted-foreground">
                  Create secure digital signatures with cryptographic keys and embed them into your documents
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome, {user?.name}
                </span>
                <Link href="/landing">
                  <Button variant="outline">Home</Button>
                </Link>
                <Button onClick={logout} variant="ghost">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Signature Creation */}
            <div className="space-y-6">
              <SignatureCanvasWithAuth
                onSignatureComplete={(data, metadata) => {
                  setSignatureData(data);
                  setSignatureMetadata(metadata);
                }}
              />
              
              {signatureData && signatureMetadata && (
                <SignaturePreview
                  signatureData={signatureData}
                  metadata={signatureMetadata}
                />
              )}
            </div>

            {/* Right Column - Document Upload and Processing */}
            <div className="space-y-6">
              <DocumentUpload
                onDocumentUpload={setDocumentFile}
                signatureData={signatureData}
                signatureMetadata={signatureMetadata}
              />
            </div>
          </div>

          <footer className="mt-16 text-center text-muted-foreground">
            <p className="text-sm">
              Secure • Encrypted • Verifiable
            </p>
          </footer>
        </div>
      </main>
    </GridBackground>
  );
}
