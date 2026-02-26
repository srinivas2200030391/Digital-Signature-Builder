import { NextRequest, NextResponse } from 'next/server';
import { nonceHash, buildMessage } from '@/lib/tempkey';

/**
 * POST /api/signatures/verify
 *
 * Challenge-response integrity verification using TempKey-based hashing.
 * The server recomputes the hash by loading the shared secret into
 * the in-memory TempKey register and hashing the same message fields.
 *
 * Request body:
 *   signerId      - identifier of the signer
 *   payload       - signed payload string
 *   timestamp     - timestamp from the signing operation
 *   challenge     - hex-encoded challenge nonce
 *   integrityHash - hex-encoded SHA-256 digest to verify
 *   secret        - hex-encoded 32-byte shared secret
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signerId, payload, timestamp, challenge, integrityHash, secret } =
      body;

    if (
      !signerId ||
      !payload ||
      !timestamp ||
      !challenge ||
      !integrityHash ||
      !secret
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Decode the shared secret from hex
    const secretBytes = new Uint8Array(
      secret.match(/.{2}/g)!.map((b: string) => parseInt(b, 16))
    );

    if (secretBytes.length !== 32) {
      return NextResponse.json(
        { error: 'Secret must be exactly 32 bytes (64 hex chars)' },
        { status: 400 }
      );
    }

    // Rebuild the canonical message from the packet fields
    const msg = buildMessage(signerId, payload, timestamp, challenge);

    // Load secret into TempKey and compute SHA-256(TempKey || msg)
    const expectedHash = await nonceHash(secretBytes, msg);

    const isValid = expectedHash === integrityHash;

    return NextResponse.json({
      verified: isValid,
      message: isValid
        ? 'Integrity verified — hash matches'
        : 'Integrity check failed — hash mismatch (data may be tampered)',
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
