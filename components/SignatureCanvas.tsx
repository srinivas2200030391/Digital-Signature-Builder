/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { generateSignatureHash, generateKeyPair } from '@/lib/crypto';

interface SignatureCanvasComponentProps {
  onSignatureComplete: (signatureData: string, metadata: any) => void;
}

export default function SignatureCanvasComponent({ onSignatureComplete }: SignatureCanvasComponentProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [mode, setMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [strokes, setStrokes] = useState<any[]>([]);
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
    let strokeData: any[] = [];

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
      setStrokes(data);
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Create Your Signature
      </h2>

      {/* Mode Selection */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('draw')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mode === 'draw'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          ✏️ Draw
        </button>
        <button
          onClick={() => setMode('type')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mode === 'type'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          ⌨️ Type
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mode === 'upload'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          📤 Upload
        </button>
      </div>

      {/* Signature Input Area */}
      <div className="mb-4">
        {mode === 'draw' && (
          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                className: 'w-full h-64',
                style: { width: '100%', height: '256px' }
              }}
              onEnd={handleStrokeEnd}
            />
          </div>
        )}

        {mode === 'type' && (
          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Type your name here..."
              className="w-full text-4xl font-cursive border-none outline-none bg-transparent text-gray-800"
              style={{ fontFamily: 'cursive' }}
            />
          </div>
        )}

        {mode === 'upload' && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 bg-white text-center">
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
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Image
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleClear}
          className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Save Signature
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>💡 Your signature will be analyzed for unique characteristics and secured with cryptographic keys.</p>
      </div>
    </div>
  );
}
