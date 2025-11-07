'use client';

import { useState } from 'react';
import SignatureCanvas from '@/components/SignatureCanvas';
import DocumentUpload from '@/components/DocumentUpload';
import SignaturePreview from '@/components/SignaturePreview';

export default function Home() {
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureMetadata, setSignatureMetadata] = useState<any>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Digital Signature Builder
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
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
            
            {signatureData && (
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

        <footer className="mt-16 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            Secure • Encrypted • Verifiable
          </p>
        </footer>
      </div>
    </main>
  );
}
