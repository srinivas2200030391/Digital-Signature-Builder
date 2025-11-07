/* eslint-disable @next/next/no-img-element */
'use client';

import { SignatureMetadata } from '@/lib/pdfProcessor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy } from 'lucide-react';

interface SignaturePreviewProps {
  signatureData: string;
  metadata: SignatureMetadata;
}

export default function SignaturePreview({ signatureData, metadata }: SignaturePreviewProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <Card className="shadow-xl backdrop-blur-sm bg-card/95">
      <CardHeader>
        <CardTitle className="text-2xl">Signature Preview</CardTitle>
        <CardDescription>Your cryptographically secured signature</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-border rounded-lg p-4 bg-muted">
          <img
            src={signatureData}
            alt="Your signature"
            className="max-h-40 mx-auto"
          />
        </div>

        <div className="space-y-3">
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Unique Hash (ID)</p>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono flex-1 break-all">
                {metadata?.hash?.substring(0, 40)}...
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard(metadata?.hash)}
                title="Copy full hash"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Public Key</p>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono flex-1 break-all">
                {metadata?.publicKey?.substring(0, 40)}...
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard(metadata?.publicKey)}
                title="Copy public key"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Private Key</p>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono flex-1 break-all">
                {metadata?.privateKey?.substring(0, 40)}...
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard(metadata?.privateKey)}
                title="Copy private key"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
            <p className="text-sm">
              {new Date(metadata?.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Signature Mode</p>
            <Badge variant="secondary" className="capitalize">
              {metadata?.mode}
            </Badge>
          </div>

          {metadata?.strokes && metadata.strokes.length > 0 && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Stroke Data Points</p>
              <p className="text-sm">
                {metadata.mode === 'draw' ? `${metadata.strokes.length} strokes recorded` : 'Processed'}
              </p>
            </div>
          )}
        </div>

        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <AlertTitle className="text-green-800 dark:text-green-200">Success</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            ✅ Signature created successfully with cryptographic security
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
