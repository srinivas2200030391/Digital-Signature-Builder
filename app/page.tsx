'use client';

import { useState } from 'react';
import SignatureCanvas from '@/components/SignatureCanvas';
import DocumentUpload from '@/components/DocumentUpload';
import SignaturePreview from '@/components/SignaturePreview';
import { SignatureMetadata } from '@/lib/pdfProcessor';
import { GridBackground } from '@/components/ui/grid-background';

export default function Home() {
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureMetadata, setSignatureMetadata] = useState<SignatureMetadata | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  return (
    <GridBackground className="min-h-screen">
      <main className="relative min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4">
              Digital Signature Builder
            </h1>
            <p className="text-lg text-muted-foreground">
              Create secure digital signatures with cryptographic keys and embed them into your documents
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Signature Creation */}
            <div className="space-y-6">
              <SignatureCanvas
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
