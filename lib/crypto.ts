export interface StrokeData {
  type?: 'draw' | 'text' | 'image';
  content?: string;
  source?: string;
  points?: any[];
}

/**
 * Generate a SHA-256 hash from signature data and strokes
 */
export async function generateSignatureHash(
  signatureData: string,
  strokes: StrokeData[]
): Promise<string> {
  // Combine signature data with stroke information for uniqueness
  const combinedData = signatureData + JSON.stringify(strokes) + Date.now();
  
  // Convert to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(combinedData);
  
  // Generate hash using SubtleCrypto
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Generate RSA key pair for digital signature
 */
export async function generateKeyPair(): Promise<{
  publicKey: string;
  privateKey: string;
}> {
  try {
    // Generate RSA key pair
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-PSS',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['sign', 'verify']
    );

    // Export keys
    const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    // Convert to base64
    const publicKeyBase64 = arrayBufferToBase64(publicKey);
    const privateKeyBase64 = arrayBufferToBase64(privateKey);

    return {
      publicKey: publicKeyBase64,
      privateKey: privateKeyBase64,
    };
  } catch (error) {
    console.error('Error generating key pair:', error);
    // Fallback to simpler key generation if WebCrypto fails
    return {
      publicKey: generateRandomKey(),
      privateKey: generateRandomKey(),
    };
  }
}

/**
 * Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Generate a random key as fallback
 */
function generateRandomKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return arrayBufferToBase64(array.buffer);
}

/**
 * Sign data with private key
 */
export async function signData(data: string, privateKeyBase64: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Import private key
    const privateKeyBuffer = base64ToArrayBuffer(privateKeyBase64);
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      {
        name: 'RSA-PSS',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    // Sign the data
    const signature = await crypto.subtle.sign(
      {
        name: 'RSA-PSS',
        saltLength: 32,
      },
      privateKey,
      dataBuffer
    );

    return arrayBufferToBase64(signature);
  } catch (error) {
    console.error('Error signing data:', error);
    // Fallback signature
    return generateRandomKey();
  }
}

/**
 * Convert Base64 to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Verify signature with public key
 */
export async function verifySignature(
  data: string,
  signatureBase64: string,
  publicKeyBase64: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Import public key
    const publicKeyBuffer = base64ToArrayBuffer(publicKeyBase64);
    const publicKey = await crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      {
        name: 'RSA-PSS',
        hash: 'SHA-256',
      },
      false,
      ['verify']
    );

    // Verify signature
    const signatureBuffer = base64ToArrayBuffer(signatureBase64);
    const isValid = await crypto.subtle.verify(
      {
        name: 'RSA-PSS',
        saltLength: 32,
      },
      publicKey,
      signatureBuffer,
      dataBuffer
    );

    return isValid;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}
