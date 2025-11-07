/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { generateSignatureHash, generateKeyPair, StrokeData } from '@/lib/crypto';
import { SignatureMetadata } from '@/lib/pdfProcessor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SignatureCanvasComponentProps {
  onSignatureComplete: (signatureData: string, metadata: SignatureMetadata) => void;
}

export default function SignatureCanvasComponent({ onSignatureComplete }: SignatureCanvasComponentProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [mode, setMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [strokes, setStrokes] = useState<StrokeData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setStrokes([]);
    setTypedName('');
    setUploadedImage(null);
  };

  const handleSave = async () => {
    let signatureData = '';
    let strokeData: StrokeData[] = [];

    if (mode === 'draw' && sigCanvas.current) {
      signatureData = sigCanvas.current.toDataURL('image/png');
      strokeData = strokes;
    } else if (mode === 'type') {
      // Generate typed signature as canvas
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
      alert('Please create a signature first');
      return;
    }

    // Generate unique hash based on strokes/content
    const hash = await generateSignatureHash(signatureData, strokeData);
    
    // Generate cryptographic key pair
    const keyPair = await generateKeyPair();

    const metadata = {
      timestamp: new Date().toISOString(),
      hash,
      strokes: strokeData,
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      mode,
    };

    onSignatureComplete(signatureData, metadata);
  };

  const handleStrokeEnd = () => {
    if (sigCanvas.current) {
      const data = sigCanvas.current.toData();
      setStrokes(data as any); // Store raw signature data
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

  return (
    <Card className="shadow-xl backdrop-blur-sm bg-card/95">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Signature</CardTitle>
        <CardDescription>Choose your preferred signature method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="flex gap-4">
          <Button
            onClick={handleClear}
            variant="outline"
            className="flex-1"
          >
            Clear
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
          >
            Save Signature
          </Button>
        </div>

        <Alert>
          <AlertDescription>
            💡 Your signature will be analyzed for unique characteristics and secured with cryptographic keys.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
