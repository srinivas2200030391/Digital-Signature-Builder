'use client';

import { useState, useRef, useEffect } from 'react';
import { embedSignatureInPDF, SignatureMetadata, UserInfo, SignaturePosition } from '@/lib/pdfProcessor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, FileText, Download, Loader2 } from 'lucide-react';

interface DocumentUploadProps {
  onDocumentUpload: (file: File | null) => void;
  signatureData: string | null;
  signatureMetadata: SignatureMetadata | null;
  personalDetails: any;
}

export default function DocumentUpload({
  onDocumentUpload,
  signatureData,
  signatureMetadata,
  personalDetails,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedDocument, setProcessedDocument] = useState<string | null>(null);
  const [signaturePosition, setSignaturePosition] = useState<SignaturePosition>({ x: 350, y: 120 });
  const [useCustomPosition, setUseCustomPosition] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
      if (processedDocument) {
        URL.revokeObjectURL(processedDocument);
      }
    };
  }, [pdfPreviewUrl, processedDocument]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      // Cleanup previous URL if exists
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
      
      setFile(uploadedFile);
      onDocumentUpload(uploadedFile);
      setProcessedDocument(null);
      
      // Create preview URL for the PDF
      const url = URL.createObjectURL(uploadedFile);
      setPdfPreviewUrl(url);
    }
  };

  const handleEmbedSignature = async () => {
    if (!file || !signatureData || !signatureMetadata) {
      alert('Please upload a document and create a signature first');
      return;
    }

    setIsProcessing(true);
    try {
      // Use personal details passed from signature creation
      const userInfo: UserInfo | undefined = personalDetails ? {
        fullName: personalDetails.fullName,
        email: personalDetails.email,
        organization: personalDetails.organization,
        designation: personalDetails.designation,
      } : undefined;

      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = await embedSignatureInPDF(
        arrayBuffer,
        signatureData,
        signatureMetadata,
        userInfo,
        useCustomPosition ? signaturePosition : undefined
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
    <Card className="shadow-xl backdrop-blur-sm bg-card/95">
      <CardHeader>
        <CardTitle className="text-2xl">Document Upload</CardTitle>
        <CardDescription>Upload and sign your PDF documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-border rounded-lg p-8 bg-muted text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {file ? (
            <div className="space-y-2">
              <FileText className="mx-auto h-12 w-12 text-primary" />
              <p className="font-medium">
                {file.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                Change File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <Button onClick={() => fileInputRef.current?.click()}>
                📤 Choose PDF Document
              </Button>
            </div>
          )}
        </div>

        {/* PDF Preview */}
        {file && pdfPreviewUrl && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Document Preview:</h3>
            <div className="border-2 border-border rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-96"
                title="PDF Preview"
              />
            </div>
          </div>
        )}

        {/* Embed Signature Button */}
        {file && signatureData && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                ✍️ Your signature will be embedded on the first page with your details and cryptographic metadata.
              </AlertDescription>
            </Alert>
            
            {/* Signature Position Controls */}
            <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Custom Signature Position</label>
                <input
                  type="checkbox"
                  checked={useCustomPosition}
                  onChange={(e) => setUseCustomPosition(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
              </div>
              
              {useCustomPosition && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      X Position (pixels from left): {signaturePosition.x}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="550"
                      value={signaturePosition.x}
                      onChange={(e) => setSignaturePosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                      className="w-full cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      Y Position (pixels from bottom): {signaturePosition.y}
                    </label>
                    <input
                      type="range"
                      min="120"
                      max="700"
                      value={signaturePosition.y}
                      onChange={(e) => setSignaturePosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                      className="w-full cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Signature dimensions are 200x100 pixels. Position is measured from bottom-left corner.
                  </p>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleEmbedSignature}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                '🔐 Embed Signature in PDF'
              )}
            </Button>
          </div>
        )}

        {/* Download Section */}
        {processedDocument && (
          <div className="space-y-4">
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <AlertTitle className="text-green-800 dark:text-green-200">
                ✅ Document signed successfully!
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                Your signature, personal details, and cryptographic keys have been embedded in the PDF. Keep your private key secure.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleDownload}
              className="w-full"
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Signed Document
            </Button>
            
            {/* Preview of signed document */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Signed Document Preview:</h3>
              <div className="border-2 border-border rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <iframe
                  src={processedDocument}
                  className="w-full h-96"
                  title="Signed PDF Preview"
                />
              </div>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <AlertTitle className="text-blue-800 dark:text-blue-200">
                What&apos;s embedded:
              </AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                  <li>Your signature image</li>
                  <li>Signer personal information</li>
                  <li>Unique signature hash/ID</li>
                  <li>Public cryptographic key</li>
                  <li>Timestamp and metadata</li>
                  <li>Stroke analysis data</li>
                </ul>
                <p className="text-xs mt-2">
                  🔒 Note: Private key is NOT embedded for security. Keep it safe separately.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Status Messages */}
        {!signatureData && (
          <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              ⚠️ Please create a signature first before uploading a document
            </AlertDescription>
          </Alert>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2 text-sm">
            Supported Features:
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ PDF document signing</li>
            <li>✓ PDF preview before signing</li>
            <li>✓ Custom signature positioning</li>
            <li>✓ Signer information embedding</li>
            <li>✓ Cryptographic key embedding</li>
            <li>✓ Signature uniqueness verification</li>
            <li>✓ Tamper-evident metadata</li>
            <li>✓ Multiple signature modes (draw, type, upload)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
