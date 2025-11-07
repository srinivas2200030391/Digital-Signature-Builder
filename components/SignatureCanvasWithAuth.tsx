/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { generateSignatureHash, generateKeyPair, StrokeData } from '@/lib/crypto';
import { SignatureMetadata } from '@/lib/pdfProcessor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

interface SignatureCanvasWithAuthProps {
  onSignatureComplete: (signatureData: string, metadata: SignatureMetadata, personalDetails: any) => void;
}

export default function SignatureCanvasWithAuth({ onSignatureComplete }: SignatureCanvasWithAuthProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [mode, setMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [strokes, setStrokes] = useState<StrokeData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  
  // Personal details
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    organization: '',
    designation: '',
    email: '',
  });

  const { token, user, isAuthenticated } = useAuth();

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setStrokes([]);
    setTypedName('');
    setUploadedImage(null);
    setShowPersonalDetails(false);
    setError('');
    setWarning('');
  };

  const handlePrepareSave = async () => {
    if (!isAuthenticated) {
      setError('Please login to save your signature');
      return;
    }

    let signatureData = '';
    let strokeData: StrokeData[] = [];

    if (mode === 'draw' && sigCanvas.current) {
      if (sigCanvas.current.isEmpty()) {
        setError('Please draw your signature first');
        return;
      }
      signatureData = sigCanvas.current.toDataURL('image/png');
      strokeData = strokes;
    } else if (mode === 'type') {
      if (!typedName.trim()) {
        setError('Please type your name');
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px cursive';
        ctx.fillStyle = 'black';
        ctx.fillText(typedName, 50, 120);
      }
      signatureData = canvas.toDataURL('image/png');
      strokeData = [{ type: 'text', content: typedName }];
    } else if (mode === 'upload' && uploadedImage) {
      signatureData = uploadedImage;
      strokeData = [{ type: 'image', source: 'upload' }];
    }

    if (!signatureData) {
      setError('Please create a signature first');
      return;
    }

    setError('');
    setWarning('');
    setLoading(true);

    try {
      // Generate hash
      const hash = await generateSignatureHash(signatureData, strokeData);
      
      // Check if signature already exists
      const checkResponse = await fetch('/api/signatures/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signatureHash: hash }),
      });

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setWarning(`⚠️ This signature is already registered to ${checkData.owner} (${checkData.email}). Please create a unique signature.`);
        setLoading(false);
        return;
      }

      // Show personal details form
      setShowPersonalDetails(true);
      setPersonalDetails({
        ...personalDetails,
        email: user?.email || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to verify signature uniqueness');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWithDetails = async () => {
    if (!personalDetails.fullName || !personalDetails.email) {
      setError('Full name and email are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let signatureData = '';
      let strokeData: StrokeData[] = [];

      if (mode === 'draw' && sigCanvas.current) {
        signatureData = sigCanvas.current.toDataURL('image/png');
        strokeData = strokes;
      } else if (mode === 'type') {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.font = '48px cursive';
          ctx.fillStyle = 'black';
          ctx.fillText(typedName, 50, 120);
        }
        signatureData = canvas.toDataURL('image/png');
        strokeData = [{ type: 'text', content: typedName }];
      } else if (mode === 'upload' && uploadedImage) {
        signatureData = uploadedImage;
        strokeData = [{ type: 'image', source: 'upload' }];
      }

      const hash = await generateSignatureHash(signatureData, strokeData);
      const keyPair = await generateKeyPair();

      const metadata: SignatureMetadata = {
        timestamp: new Date().toISOString(),
        hash,
        strokes: strokeData,
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        mode,
      };

      // Save to database
      const response = await fetch('/api/signatures/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          signatureHash: hash,
          signatureData,
          metadata,
          personalDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save signature');
      }

      onSignatureComplete(signatureData, metadata, personalDetails);
      setShowPersonalDetails(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save signature');
    } finally {
      setLoading(false);
    }
  };

  const handleStrokeEnd = () => {
    if (sigCanvas.current) {
      const data = sigCanvas.current.toData();
      setStrokes(data as any);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="shadow-xl backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Signature</CardTitle>
          <CardDescription>Please login to create and save signatures</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              🔒 You must be logged in to create and save digital signatures.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl backdrop-blur-sm bg-card/95">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Signature</CardTitle>
        <CardDescription>Choose your preferred signature method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showPersonalDetails ? (
          <>
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'draw' | 'type' | 'upload')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="draw">✏️ Draw</TabsTrigger>
                <TabsTrigger value="type">⌨️ Type</TabsTrigger>
                <TabsTrigger value="upload">📤 Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="draw" className="space-y-4">
                <div className="border-2 border-border rounded-lg overflow-hidden bg-white">
                  <SignatureCanvas
                    ref={sigCanvas}
                    canvasProps={{
                      className: 'w-full h-64',
                      style: { width: '100%', height: '256px' }
                    }}
                    onEnd={handleStrokeEnd}
                  />
                </div>
              </TabsContent>

              <TabsContent value="type" className="space-y-4">
                <div className="border-2 border-border rounded-lg p-4 bg-white">
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Type your name here..."
                    className="w-full text-4xl font-cursive border-none outline-none bg-transparent text-gray-800"
                    style={{ fontFamily: 'cursive' }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 bg-muted text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Uploaded signature"
                      className="max-h-64 mx-auto"
                    />
                  ) : (
                    <Button onClick={() => fileInputRef.current?.click()}>
                      Choose Image
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {warning && (
              <Alert>
                <AlertDescription className="text-yellow-600">{warning}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleClear}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Clear
              </Button>
              <Button
                onClick={handlePrepareSave}
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Next: Add Details'}
              </Button>
            </div>

            <Alert>
              <AlertDescription>
                💡 Your signature will be analyzed for unique characteristics and secured with cryptographic keys.
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Details</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <input
                type="text"
                value={personalDetails.fullName}
                onChange={(e) => setPersonalDetails({ ...personalDetails, fullName: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <input
                type="email"
                value={personalDetails.email}
                onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Organization (Optional)</label>
              <input
                type="text"
                value={personalDetails.organization}
                onChange={(e) => setPersonalDetails({ ...personalDetails, organization: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Acme Corporation"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Designation (Optional)</label>
              <input
                type="text"
                value={personalDetails.designation}
                onChange={(e) => setPersonalDetails({ ...personalDetails, designation: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Software Engineer"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                onClick={() => setShowPersonalDetails(false)}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                onClick={handleSaveWithDetails}
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Signature'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
