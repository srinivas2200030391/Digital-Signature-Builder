import { NextRequest, NextResponse } from 'next/server';
import { nonceHash, buildMessage } from '@/lib/tempkey';

/**
 * POST /api/signatures/verify
 *
 * Challenge-response integrity verification using TempKey-based hashing.
 * The server recomputes the hash by loading the shared secret (from the
 * TEMPKEY_SHARED_SECRET environment variable) into the in-memory TempKey
 * register and hashing the same message fields.
 *
 * Request body:
 *   signerId      - identifier of the signer
 *   payload       - signed payload string
 *   timestamp     - timestamp from the signing operation
 *   challenge     - hex-encoded challenge nonce
 *   integrityHash - hex-encoded SHA-256 digest to verify
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signerId, payload, timestamp, challenge, integrityHash } = body;

    if (!signerId || !payload || !timestamp || !challenge || !integrityHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Load shared secret from environment (never from client)
    const secretHex = process.env.TEMPKEY_SHARED_SECRET;
    if (!secretHex || !/^[0-9a-f]{64}$/i.test(secretHex)) {
      return NextResponse.json(
        { error: 'Server shared secret is not configured' },
        { status: 500 }
      );
    }

    const secretBytes = new Uint8Array(
      (secretHex.match(/.{2}/g) as RegExpMatchArray).map((b) =>
        parseInt(b, 16)
      )
    );

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
