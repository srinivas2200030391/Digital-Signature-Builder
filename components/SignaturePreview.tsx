/* eslint-disable @next/next/no-img-element */
'use client';

interface SignaturePreviewProps {
  signatureData: string;
  metadata: any;
}

export default function SignaturePreview({ signatureData, metadata }: SignaturePreviewProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Signature Preview
      </h2>

      <div className="mb-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
        <img
          src={signatureData}
          alt="Your signature"
          className="max-h-40 mx-auto"
        />
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Unique Hash (ID)</p>
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all flex-1">
              {metadata?.hash?.substring(0, 40)}...
            </code>
            <button
              onClick={() => copyToClipboard(metadata?.hash)}
              className="text-blue-600 hover:text-blue-700 text-xs"
              title="Copy full hash"
            >
              📋
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Public Key</p>
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all flex-1">
              {metadata?.publicKey?.substring(0, 40)}...
            </code>
            <button
              onClick={() => copyToClipboard(metadata?.publicKey)}
              className="text-blue-600 hover:text-blue-700 text-xs"
              title="Copy public key"
            >
              📋
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Private Key</p>
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all flex-1">
              {metadata?.privateKey?.substring(0, 40)}...
            </code>
            <button
              onClick={() => copyToClipboard(metadata?.privateKey)}
              className="text-blue-600 hover:text-blue-700 text-xs"
              title="Copy private key"
            >
              📋
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Timestamp</p>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {new Date(metadata?.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Signature Mode</p>
          <p className="text-sm text-gray-800 dark:text-gray-200 capitalize">
            {metadata?.mode}
          </p>
        </div>

        {metadata?.strokes && metadata.strokes.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Stroke Data Points</p>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {metadata.mode === 'draw' ? `${metadata.strokes.length} strokes recorded` : 'Processed'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <p className="text-sm text-green-800 dark:text-green-200">
          ✅ Signature created successfully with cryptographic security
        </p>
      </div>
    </div>
  );
}
