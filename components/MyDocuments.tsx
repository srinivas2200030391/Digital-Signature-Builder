'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Download, Loader2, X, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { embedSignatureInPDF, SignatureMetadata, UserInfo, SignaturePosition } from '@/lib/pdfProcessor';

interface MyDocumentsProps {
  signatureData: string | null;
  signatureMetadata: SignatureMetadata | null;
  personalDetails: any;
}

interface DocumentItem {
  id: string;
  name: string;
  file: File;
  uploadedAt: Date;
  signed: boolean;
  signedUrl?: string;
}

export default function MyDocuments({
  signatureData,
  signatureMetadata,
  personalDetails,
}: MyDocumentsProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [signaturePosition, setSignaturePosition] = useState<SignaturePosition>({ x: 350, y: 120 });
  const [useCustomPosition, setUseCustomPosition] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newDocs: DocumentItem[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      file,
      uploadedAt: new Date(),
      signed: false,
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const handleSelectDocument = async (doc: DocumentItem) => {
    // Cleanup previous URL if exists
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    
    setSelectedDoc(doc);
    
    // Create a preview URL for the PDF
    const url = URL.createObjectURL(doc.file);
    setPdfUrl(url);
  };

  const handleEmbedSignature = async () => {
    if (!selectedDoc || !signatureData || !signatureMetadata) {
      setError('Please select a document and create a signature first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const userInfo: UserInfo | undefined = personalDetails
        ? {
            fullName: personalDetails.fullName,
            email: personalDetails.email,
            organization: personalDetails.organization,
            designation: personalDetails.designation,
          }
        : undefined;

      const arrayBuffer = await selectedDoc.file.arrayBuffer();
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

      // Update document as signed
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === selectedDoc.id
            ? { ...doc, signed: true, signedUrl: url }
            : doc
        )
      );

      setSelectedDoc((prev) => (prev ? { ...prev, signed: true, signedUrl: url } : null));
    } catch (error) {
      console.error('Error embedding signature:', error);
      setError('Error processing document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (doc: DocumentItem) => {
    if (doc.signedUrl) {
      const link = document.createElement('a');
      link.href = doc.signedUrl;
      link.download = `signed_${doc.name}`;
      link.click();
    }
  };

  const handleRemoveDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
    if (selectedDoc?.id === docId) {
      setSelectedDoc(null);
      setPdfUrl(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Document List */}
      <Card className="shadow-xl backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle className="text-2xl">My Documents</CardTitle>
          <CardDescription>Upload and manage your PDF documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <Button onClick={() => fileInputRef.current?.click()}>
              Upload PDF Documents
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Supports PDF files. You can upload multiple files.
            </p>
          </div>

          {/* Document List */}
          {documents.length > 0 ? (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Uploaded Documents ({documents.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedDoc?.id === doc.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-border hover:border-blue-300'
                    }`}
                    onClick={() => handleSelectDocument(doc)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.signed && (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(doc);
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveDocument(doc.id);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                📄 No documents uploaded yet. Upload a PDF to get started.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* PDF Viewer & Signature Placement */}
      <Card className="shadow-xl backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle className="text-2xl">Document Preview</CardTitle>
          <CardDescription>
            {selectedDoc ? `Preview and sign: ${selectedDoc.name}` : 'Select a document to preview'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedDoc ? (
            <>
              {/* PDF Preview */}
              <div className="border-2 border-border rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    className="w-full h-96"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="h-96 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Signature Actions */}
              {!selectedDoc.signed ? (
                <>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {signatureData && signatureMetadata ? (
                    <div className="space-y-4">
                      <Alert>
                        <AlertDescription>
                          ✍️ Your signature will be embedded on the first page with your details and cryptographic metadata.
                        </AlertDescription>
                      </Alert>
                      
                      {/* Signature Position Controls */}
                      <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Custom Position</label>
                          <input
                            type="checkbox"
                            checked={useCustomPosition}
                            onChange={(e) => setUseCustomPosition(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300"
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
                                className="w-full"
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
                                className="w-full"
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
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Embedding Signature...
                          </>
                        ) : (
                          'Embed Signature in PDF'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Alert>
                      <AlertDescription>
                        ⚠️ Please create a signature first before signing documents.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      ✅ This document has been successfully signed!
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={() => handleDownload(selectedDoc)}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Signed Document
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="h-96 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a document from the list to preview</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
