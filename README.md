# Digital Signature Builder

A modern Next.js application for creating secure digital signatures with cryptographic keys and embedding them into PDF documents.

![Digital Signature Builder](https://github.com/user-attachments/assets/d7ba6819-d2bb-496b-ab22-29995686f85f)

## Features

✨ **Multiple Signature Input Methods**
- ✏️ **Draw**: Hand-draw your signature using a canvas
- ⌨️ **Type**: Type your name and convert it to a signature
- 📤 **Upload**: Upload an existing signature image

🔐 **Cryptographic Security**
- Generates unique SHA-256 hash for each signature based on strokes/content
- Creates RSA-2048 key pairs (public and private keys)
- Embeds cryptographic keys into PDF documents
- Provides tamper-evident metadata

📄 **PDF Document Signing**
- Upload PDF documents for signing
- Embeds signature image on the first page
- Adds comprehensive metadata page with:
  - Signature hash (unique ID)
  - Public and private cryptographic keys
  - Timestamp and signature mode
  - Stroke analysis data
  - Security information

🎨 **Modern User Interface**
- Beautiful gradient design with dark mode support
- Responsive layout for all devices
- Real-time signature preview
- Copy-to-clipboard functionality for keys and hashes

## Technology Stack

- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first CSS framework
- **react-signature-canvas** - Signature drawing functionality
- **pdf-lib** - PDF manipulation and generation
- **Web Crypto API** - Cryptographic operations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/srinivas2200030391/Digital-Signature-Builder.git
cd Digital-Signature-Builder
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Creating a Signature

1. **Choose a signature method**:
   - **Draw**: Use your mouse or touchscreen to draw your signature
   - **Type**: Enter your name in the text field
   - **Upload**: Select an existing signature image file

2. **Save the signature**:
   - Click "Save Signature" button
   - The system generates:
     - Unique signature hash (SHA-256)
     - RSA-2048 key pair (public/private keys)
     - Timestamp and metadata

3. **View signature details**:
   - Preview your signature image
   - Copy cryptographic keys and hash
   - Review timestamp and signature mode

### Signing a PDF Document

1. **Upload a PDF**:
   - Click "Choose PDF Document"
   - Select your PDF file

2. **Embed signature**:
   - Click "Embed Signature in PDF"
   - Wait for processing

3. **Download signed document**:
   - Click "Download Signed Document"
   - The PDF will contain:
     - Your signature on the first page
     - Complete metadata page with cryptographic details

## Security Features

- **Unique Signature Hash**: Each signature gets a unique SHA-256 hash based on the signature data and strokes, ensuring uniqueness
- **RSA-2048 Encryption**: Industry-standard cryptographic keys for signature verification
- **Stroke Analysis**: For drawn signatures, stroke data is captured and included in the hash
- **Tamper Detection**: Any modification to the signed document can be detected through hash verification
- **Metadata Embedding**: All signature data is embedded in the PDF for future verification

## Project Structure

```
Digital-Signature-Builder/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Main page component
├── components/
│   ├── SignatureCanvas.tsx   # Signature creation component
│   ├── SignaturePreview.tsx  # Signature preview component
│   └── DocumentUpload.tsx    # PDF upload and processing
├── lib/
│   ├── crypto.ts             # Cryptographic functions
│   └── pdfProcessor.ts       # PDF manipulation functions
├── public/                   # Static assets
├── package.json              # Dependencies
└── README.md                 # This file
```

## API Reference

### Cryptographic Functions (`lib/crypto.ts`)

- `generateSignatureHash(signatureData, strokes)` - Generates unique SHA-256 hash
- `generateKeyPair()` - Creates RSA-2048 key pair
- `signData(data, privateKey)` - Signs data with private key
- `verifySignature(data, signature, publicKey)` - Verifies signature authenticity

### PDF Processing (`lib/pdfProcessor.ts`)

- `embedSignatureInPDF(pdfBuffer, signatureData, metadata)` - Embeds signature in PDF
- `extractSignatureMetadata(pdfBuffer)` - Extracts metadata from signed PDF

## Screenshots

### Main Interface
![Main Interface](https://github.com/user-attachments/assets/d7ba6819-d2bb-496b-ab22-29995686f85f)

### Signature Created
![Signature Created](https://github.com/user-attachments/assets/c27e0c55-e491-4750-9845-3a99183a95ac)

### Type Signature Mode
![Type Signature](https://github.com/user-attachments/assets/28639606-173f-45e1-86c2-efd2550b4f47)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with Next.js and React
- Uses pdf-lib for PDF manipulation
- Cryptography powered by Web Crypto API
- UI styled with Tailwind CSS