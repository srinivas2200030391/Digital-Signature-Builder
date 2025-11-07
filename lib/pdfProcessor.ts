import { PDFDocument, rgb } from 'pdf-lib';
import { StrokeData } from './crypto';

export interface SignatureMetadata {
  timestamp: string;
  hash: string;
  strokes: StrokeData[];
  publicKey: string;
  privateKey: string;
  mode: string;
}

/**
 * Embed signature and metadata into a PDF document
 */
export async function embedSignatureInPDF(
  pdfBuffer: ArrayBuffer,
  signatureData: string,
  metadata: SignatureMetadata
): Promise<Uint8Array> {
  // Load the existing PDF
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  // Get the first page
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  // Convert base64 signature image to embedded image
  const signatureImageBytes = base64ToArrayBuffer(signatureData);
  
  // Detect image format and embed accordingly
  let signatureImage;
  try {
    // Try PNG first
    signatureImage = await pdfDoc.embedPng(signatureImageBytes);
  } catch (e) {
    // If PNG fails, try JPEG
    try {
      signatureImage = await pdfDoc.embedJpg(signatureImageBytes);
    } catch (e2) {
      throw new Error('Unsupported image format. Please use PNG or JPEG.');
    }
  }

  // Calculate signature dimensions and position
  const signatureWidth = 200;
  const signatureHeight = 100;
  const x = width - signatureWidth - 50; // 50px margin from right
  const y = 50; // 50px from bottom

  // Draw signature on the page
  firstPage.drawImage(signatureImage, {
    x,
    y,
    width: signatureWidth,
    height: signatureHeight,
  });

  // Add text annotation with timestamp
  const fontSize = 8;
  firstPage.drawText(`Digitally signed on: ${new Date(metadata.timestamp).toLocaleString()}`, {
    x,
    y: y - 15,
    size: fontSize,
    color: rgb(0, 0, 0.5),
  });

  // Embed metadata in PDF custom properties
  pdfDoc.setTitle('Digitally Signed Document');
  pdfDoc.setSubject('Document signed with Digital Signature Builder');
  pdfDoc.setCreator('Digital Signature Builder');
  pdfDoc.setProducer('Digital Signature Builder');
  pdfDoc.setKeywords([
    'digital-signature',
    `hash:${metadata.hash}`,
    `timestamp:${metadata.timestamp}`,
    `mode:${metadata.mode}`,
  ]);

  // Add metadata as a custom field in the PDF
  // Note: pdf-lib doesn't directly support custom metadata fields in the same way,
  // but we can add it as a comment or annotation

  // Create a metadata page at the end
  const metadataPage = pdfDoc.addPage();
  const metadataPageSize = metadataPage.getSize();

  // Add metadata content
  metadataPage.drawText('Digital Signature Metadata', {
    x: 50,
    y: metadataPageSize.height - 50,
    size: 16,
    color: rgb(0, 0, 0),
  });

  let yPosition = metadataPageSize.height - 80;
  const lineHeight = 15;

  const addMetadataLine = (label: string, value: string, maxLength = 80) => {
    metadataPage.drawText(`${label}:`, {
      x: 50,
      y: yPosition,
      size: 10,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineHeight;

    // Split long values into multiple lines
    const chunks = splitString(value, maxLength);
    chunks.forEach(chunk => {
      metadataPage.drawText(chunk, {
        x: 70,
        y: yPosition,
        size: 8,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPosition -= lineHeight;
    });
    yPosition -= 5; // Extra spacing between fields
  };

  addMetadataLine('Signature Hash (Unique ID)', metadata.hash);
  addMetadataLine('Public Key', metadata.publicKey);
  // Note: Private key is NOT embedded for security reasons
  addMetadataLine('Timestamp', metadata.timestamp);
  addMetadataLine('Signature Mode', metadata.mode);
  addMetadataLine('Stroke Data Points', 
    metadata.mode === 'draw' ? `${metadata.strokes?.length || 0} strokes` : 'Processed'
  );

  // Add security notice
  yPosition -= 20;
  metadataPage.drawText('Security Information:', {
    x: 50,
    y: yPosition,
    size: 12,
    color: rgb(0.5, 0, 0),
  });
  yPosition -= lineHeight * 1.5;

  const securityInfo = [
    '• This document has been digitally signed with cryptographic keys',
    '• The signature hash provides a unique identifier for verification',
    '• Any modifications to this document can be detected',
    '• Keep the private key secure for signature validation',
  ];

  securityInfo.forEach(info => {
    metadataPage.drawText(info, {
      x: 50,
      y: yPosition,
      size: 9,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineHeight;
  });

  // Save and return the modified PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

/**
 * Split a string into chunks of specified length
 */
function splitString(str: string, maxLength: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += maxLength) {
    chunks.push(str.substring(i, i + maxLength));
  }
  return chunks;
}

/**
 * Convert base64 data URL to ArrayBuffer
 */
function base64ToArrayBuffer(dataUrl: string): Uint8Array {
  // Extract base64 data from data URL
  const base64Data = dataUrl.split(',')[1] || dataUrl;
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export interface ExtractedMetadata {
  title?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  [key: string]: string | undefined;
}

/**
 * Extract signature metadata from a signed PDF
 */
export async function extractSignatureMetadata(pdfBuffer: ArrayBuffer): Promise<ExtractedMetadata | null> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Extract metadata from keywords
    const keywords = pdfDoc.getKeywords();
    const metadata: { [key: string]: string } = {};

    if (keywords) {
      const keywordArray = keywords.split(',');
      keywordArray.forEach(keyword => {
        const [key, value] = keyword.split(':');
        if (key && value) {
          metadata[key.trim()] = value.trim();
        }
      });
    }

    return {
      title: pdfDoc.getTitle(),
      subject: pdfDoc.getSubject(),
      creator: pdfDoc.getCreator(),
      producer: pdfDoc.getProducer(),
      ...metadata,
    };
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return null;
  }
}
