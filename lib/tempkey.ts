/**
 * TempKey - Software implementation of volatile in-memory key storage
 * inspired by the ATSHA204A hardware security chip's TempKey register.
 *
 * TempKey is a 32-byte volatile key stored only in RAM. It is loaded
 * via a nonce operation and then used as part of SHA-256 hash computations.
 * This provides challenge-response authentication and message integrity
 * without exposing the shared secret in transmitted data.
 *
 * Flow:
 *   1. Load a nonce (shared secret) into TempKey
 *   2. Compute SHA-256 over (TempKey || message data)
 *   3. The same nonce + data always produces the same hash
 *   4. Different nonce or data produces a different hash
 */

const TEMPKEY_SIZE = 32;
const NONCE_MODE_PASSTHROUGH = 0x03;

/**
 * TempKey register — volatile, in-memory only.
 * Cleared on every new nonce load to prevent stale state.
 */
let tempKeyStore: Uint8Array | null = null;

/**
 * Load a 32-byte nonce into the TempKey register.
 * This primes the internal state for subsequent hash operations.
 * Mirrors ATSHA204A `atcab_nonce_base(PASSTHROUGH, ...)`.
 */
export function loadNonce(nonce: Uint8Array): void {
  if (nonce.length !== TEMPKEY_SIZE) {
    throw new Error(
      `Nonce must be exactly ${TEMPKEY_SIZE} bytes, got ${nonce.length}`
    );
  }
  // Store a copy so the caller cannot mutate it
  tempKeyStore = new Uint8Array(nonce);
}

/**
 * Clear the TempKey register (equivalent to chip reset / release).
 */
export function clearTempKey(): void {
  if (tempKeyStore) {
    // Zero-fill before discarding
    tempKeyStore.fill(0);
    tempKeyStore = null;
  }
}

/**
 * Return whether TempKey is currently loaded.
 */
export function isTempKeyLoaded(): boolean {
  return tempKeyStore !== null;
}

/**
 * Compute SHA-256 over (TempKey || data).
 * TempKey must be loaded via `loadNonce` before calling this.
 *
 * This mirrors the ATSHA204A pattern:
 *   1. Nonce command loads secret into TempKey
 *   2. SHA command hashes TempKey concatenated with message
 *
 * @param data - arbitrary message bytes to hash
 * @returns hex-encoded SHA-256 digest
 */
export async function hashWithTempKey(data: Uint8Array): Promise<string> {
  if (!tempKeyStore) {
    throw new Error('TempKey is not loaded. Call loadNonce() first.');
  }

  // Combine TempKey || data
  const combined = new Uint8Array(tempKeyStore.length + data.length);
  combined.set(tempKeyStore, 0);
  combined.set(data, tempKeyStore.length);

  // SHA-256
  const digest = await crypto.subtle.digest('SHA-256', combined);
  const hashArray = Array.from(new Uint8Array(digest));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Atomic nonce-then-hash operation.
 * Loads the nonce into TempKey, then computes SHA-256(nonce || data).
 * Both steps are performed as a single logical operation, ensuring
 * the TempKey state is identical for signing and verification.
 *
 * @param nonce - 32-byte shared secret or session key
 * @param data  - message bytes to hash
 * @returns hex-encoded SHA-256 digest
 */
export async function nonceHash(
  nonce: Uint8Array,
  data: Uint8Array
): Promise<string> {
  loadNonce(nonce);
  return hashWithTempKey(data);
}

/**
 * Generate a 32-byte cryptographic challenge for challenge-response auth.
 * Each challenge is unique, preventing replay attacks.
 */
export function generateChallenge(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(TEMPKEY_SIZE));
}

/**
 * Build a canonical message from structured fields.
 * Mirrors the IoT signing pattern: deviceId + payload + timestamp + challenge.
 */
export function buildMessage(
  signerId: string,
  payload: string,
  timestamp: string,
  challengeHex: string
): Uint8Array {
  const message = `${signerId}:${payload}:${timestamp}:${challengeHex}`;
  return new TextEncoder().encode(message);
}

/**
 * Sign: load shared secret into TempKey, hash the message.
 * Returns a packet containing all public fields plus the integrity hash.
 * The shared secret is NOT included in the packet.
 */
export async function sign(
  signerId: string,
  payload: string,
  sharedSecret: Uint8Array,
  challenge: Uint8Array
): Promise<{
  signerId: string;
  payload: string;
  timestamp: string;
  challenge: string;
  integrityHash: string;
}> {
  const timestamp = Date.now().toString();
  const challengeHex = Array.from(challenge)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const msg = buildMessage(signerId, payload, timestamp, challengeHex);
  const integrityHash = await nonceHash(sharedSecret, msg);

  return {
    signerId,
    payload,
    timestamp,
    challenge: challengeHex,
    integrityHash,
  };
}

/**
 * Verify: rebuild the message and recompute the hash using the same
 * shared secret loaded into TempKey. If hashes match, the data is authentic.
 */
export async function verify(
  packet: {
    signerId: string;
    payload: string;
    timestamp: string;
    challenge: string;
    integrityHash: string;
  },
  sharedSecret: Uint8Array
): Promise<boolean> {
  const msg = buildMessage(
    packet.signerId,
    packet.payload,
    packet.timestamp,
    packet.challenge
  );

  const expectedHash = await nonceHash(sharedSecret, msg);
  return expectedHash === packet.integrityHash;
}
