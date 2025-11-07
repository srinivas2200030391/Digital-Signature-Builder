'use client';

import { useState, useRef } from 'react';
import { embedSignatureInPDF, SignatureMetadata } from '@/lib/pdfProcessor';

interface DocumentUploadProps {
  onDocumentUpload: (file: File | null) => void;
  signatureData: string | null;
  signatureMetadata: SignatureMetadata | null;
}

export default function DocumentUpload({
  onDocumentUpload,
  signatureData,
  signatureMetadata,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedDocument, setProcessedDocument] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      onDocumentUpload(uploadedFile);
      setProcessedDocument(null);
    }
  };

  const handleEmbedSignature = async () => {
    if (!file || !signatureData || !signatureMetadata) {
      alert('Please upload a document and create a signature first');
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = await embedSignatureInPDF(
        arrayBuffer,
        signatureData,
        signatureMetadata
      );

      // Create blob and download URL
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setProcessedDocument(url);
    } catch (error) {
      console.error('Error embedding signature:', error);
      alert('Error processing document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedDocument) {
      const link = document.createElement('a');
      link.href = processedDocument;
      link.download = `signed_${file?.name || 'document.pdf'}`;
      link.click();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Document Upload
      </h2>

      <div className="space-y-4">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 bg-gray-50 dark:bg-gray-900 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {file ? (
            <div className="space-y-2">
              <div className="text-4xl">📄</div>
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {file.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Change File
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📤 Choose PDF Document
            </button>
          )}
        </div>

        {/* Embed Signature Button */}
        {file && signatureData && (
          <button
            onClick={handleEmbedSignature}
            disabled={isProcessing}
            className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-colors ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span>
                Processing...
              </span>
            ) : (
              '🔐 Embed Signature in PDF'
            )}
          </button>
        )}

        {/* Download Section */}
        {processedDocument && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium mb-2">
                ✅ Document signed successfully!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your signature and public key have been embedded in the PDF. Keep your private key secure.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              ⬇️ Download Signed Document
            </button>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>What&apos;s embedded:</strong>
              </p>
              <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-disc list-inside">
                <li>Your signature image</li>
                <li>Unique signature hash/ID</li>
                <li>Public cryptographic key</li>
                <li>Timestamp and metadata</li>
                <li>Stroke analysis data</li>
              </ul>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                🔒 Note: Private key is NOT embedded for security. Keep it safe separately.
              </p>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {!signatureData && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Please create a signature first before uploading a document
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
          Supported Features:
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>✓ PDF document signing</li>
          <li>✓ Cryptographic key embedding</li>
          <li>✓ Signature verification data</li>
          <li>✓ Tamper-evident metadata</li>
          <li>✓ Multiple signature modes (draw, type, upload)</li>
        </ul>
      </div>
    </div>
  );
}
