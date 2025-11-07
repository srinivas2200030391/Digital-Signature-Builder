# Digital Signature Builder

A modern Next.js application for creating secure digital signatures with cryptographic keys, user authentication, and MongoDB database integration. Features an animated landing page and complete user management system.

![Digital Signature Builder](https://github.com/user-attachments/assets/d7ba6819-d2bb-496b-ab22-29995686f85f)

## Features

### 🎨 **Landing Page with Animations**
- Beautiful animated hero section with GSAP
- Floating background elements
- Scroll-triggered animations for features and sections
- Responsive navbar with authentication status
- Modern footer with links and branding

### 🔐 **User Authentication & Database**
- MongoDB integration for user and signature storage
- Secure JWT-based authentication
- Login and signup pages with form validation
- Protected dashboard routes
- User session management with AuthContext
- Environment-based configuration (.env)

### ✨ **Multiple Signature Input Methods**
- ✏️ **Draw**: Hand-draw your signature using a canvas
- ⌨️ **Type**: Type your name and convert it to a signature
- 📤 **Upload**: Upload an existing signature image

### 🛡️ **Signature Uniqueness & Security**
- Database-backed signature uniqueness validation
- Prevents duplicate signatures across users
- Warning system when attempting to use an existing signature
- Personal details collection (name, email, organization, designation)
- SHA-256 hash generation for each signature
- RSA-2048 key pairs (public and private keys)

### 📄 **Enhanced PDF Document Signing**
- Upload PDF documents for signing
- Embeds signature image on the first page with signer details
- Comprehensive metadata page including:
  - Signer information (name, email, organization, designation)
  - Signature hash (unique ID)
  - Public cryptographic key
  - Timestamp and signature mode
  - Stroke analysis data
  - Security information
- Tamper-evident cryptographic embedding

### 🎨 **Modern User Interface**
- Beautiful gradient design with dark mode support
- Responsive layout for all devices
- Real-time signature preview
- Copy-to-clipboard functionality for keys and hashes
- GSAP-powered animations throughout

## Technology Stack

- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe code
- **MongoDB & Mongoose** - Database and ODM
- **JWT & bcryptjs** - Authentication and password hashing
- **GSAP** - Professional-grade animations
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Re-usable component library
- **react-signature-canvas** - Signature drawing functionality
- **pdf-lib** - PDF manipulation and generation
- **Web Crypto API** - Cryptographic operations
- **Framer Motion** - React animation library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MongoDB instance (local or MongoDB Atlas)

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

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the MongoDB connection string
   - Set secure secrets for JWT and NextAuth

```bash
cp .env.example .env
```

Edit `.env` file:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/digital-signature-builder
# Or use MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/digital-signature-builder

# Authentication Secrets (change these in production!)
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-here-change-in-production
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000/landing](http://localhost:3000/landing) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Getting Started

1. **Visit the Landing Page**:
   - Navigate to [http://localhost:3000/landing](http://localhost:3000/landing)
   - Explore features, how it works, and security information
   - Click "Get Started" or "Sign Up" to create an account

2. **Create an Account**:
   - Fill in your name, email, and password
   - Click "Sign Up" to register
   - You'll be automatically logged in and redirected to the dashboard

3. **Login**:
   - If you already have an account, click "Sign In"
   - Enter your email and password
   - Access the dashboard to create signatures

### Creating a Signature

1. **Choose a signature method**:
   - **Draw**: Use your mouse or touchscreen to draw your signature
   - **Type**: Enter your name in the text field
   - **Upload**: Select an existing signature image file

2. **Click "Next: Add Details"**:
   - The system checks if your signature is unique
   - If duplicate detected, you'll be warned to create a different signature
   - If unique, you'll proceed to personal details

3. **Fill in Personal Details**:
   - Full Name (required)
   - Email (required)
   - Organization (optional)
   - Designation (optional)

4. **Save the signature**:
   - Click "Save Signature" button
   - The system generates:
     - Unique signature hash (SHA-256)
     - RSA-2048 key pair (public/private keys)
     - Timestamp and metadata
   - Signature is stored in the database

5. **View signature details**:
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
   - Your signature and personal details are embedded

3. **Download signed document**:
   - Click "Download Signed Document"
   - The PDF will contain:
     - Your signature on the first page
     - Your name, organization (if provided)
     - Complete metadata page with:
       - Signer information
       - Signature hash and public key
       - Timestamp and cryptographic details

## Security Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Database Storage**: All signatures and user data stored securely in MongoDB
- **Unique Signature Hash**: Each signature gets a unique SHA-256 hash based on the signature data and strokes
- **Signature Uniqueness Validation**: Database checks prevent duplicate signatures across users
- **RSA-2048 Encryption**: Industry-standard cryptographic keys for signature verification
- **Stroke Analysis**: For drawn signatures, stroke data is captured and included in the hash
- **Tamper Detection**: Any modification to the signed document can be detected through hash verification
- **Metadata Embedding**: All signature data and signer information embedded in the PDF
- **Private Key Security**: Private keys are never embedded in PDFs, stored separately

## Project Structure

```
Digital-Signature-Builder/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts         # Login API endpoint
│   │   │   └── signup/route.ts        # Signup API endpoint
│   │   └── signatures/
│   │       ├── create/route.ts        # Create signature API
│   │       └── check/route.ts         # Check signature uniqueness
│   ├── landing/page.tsx               # Animated landing page
│   ├── login/page.tsx                 # Login page
│   ├── signup/page.tsx                # Signup page
│   ├── globals.css                    # Global styles
│   ├── layout.tsx                     # Root layout with AuthProvider
│   └── page.tsx                       # Main dashboard (protected)
├── components/
│   ├── landing/
│   │   ├── Navbar.tsx                 # Landing page navbar
│   │   ├── HeroSection.tsx            # Animated hero section
│   │   ├── FeaturesSection.tsx        # Features with animations
│   │   ├── HowItWorksSection.tsx      # How it works section
│   │   ├── SecuritySection.tsx        # Security features
│   │   └── Footer.tsx                 # Footer component
│   ├── SignatureCanvas.tsx            # Original signature component
│   ├── SignatureCanvasWithAuth.tsx    # Enhanced with auth & validation
│   ├── SignaturePreview.tsx           # Signature preview component
│   └── DocumentUpload.tsx             # PDF upload and processing
├── contexts/
│   └── AuthContext.tsx                # Authentication context
├── lib/
│   ├── crypto.ts                      # Cryptographic functions
│   ├── mongodb.ts                     # MongoDB connection
│   ├── pdfProcessor.ts                # PDF manipulation with user info
│   └── utils.ts                       # Utility functions
├── models/
│   ├── User.ts                        # User mongoose model
│   └── Signature.ts                   # Signature mongoose model
├── public/                            # Static assets
├── .env.example                       # Example environment variables
├── package.json                       # Dependencies
└── README.md                          # This file
```

## API Reference

### Authentication API (`app/api/auth/`)

#### POST `/api/auth/signup`
- **Body**: `{ email, password, name }`
- **Returns**: User object and JWT token
- **Description**: Creates a new user account

#### POST `/api/auth/login`
- **Body**: `{ email, password }`
- **Returns**: User object and JWT token
- **Description**: Authenticates user and returns token

### Signature API (`app/api/signatures/`)

#### POST `/api/signatures/create`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ signatureHash, signatureData, metadata, personalDetails }`
- **Returns**: Created signature object
- **Description**: Saves signature to database with uniqueness validation

#### POST `/api/signatures/check`
- **Body**: `{ signatureHash }`
- **Returns**: `{ exists, message, owner?, email? }`
- **Description**: Checks if signature hash already exists in database

### Cryptographic Functions (`lib/crypto.ts`)

- `generateSignatureHash(signatureData, strokes)` - Generates unique SHA-256 hash
- `generateKeyPair()` - Creates RSA-2048 key pair
- `signData(data, privateKey)` - Signs data with private key
- `verifySignature(data, signature, publicKey)` - Verifies signature authenticity

### PDF Processing (`lib/pdfProcessor.ts`)

- `embedSignatureInPDF(pdfBuffer, signatureData, metadata, userInfo?)` - Embeds signature and user info in PDF
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

- Built with Next.js 15 and React
- MongoDB for database storage
- GSAP for professional animations
- Shadcn UI and Tailwind CSS for beautiful components
- pdf-lib for PDF manipulation
- Cryptography powered by Web Crypto API
- Authentication with JWT and bcryptjs

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/digital-signature-builder

# Authentication Secrets
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-here
```

**Important**: Change the secret keys in production to secure random strings.

## Notes

- The landing page is accessible at `/landing`
- The main dashboard requires authentication and is at `/`
- Users must be logged in to create and save signatures
- Each signature is unique and tied to a user account
- Signature uniqueness is validated before saving
- Personal details are embedded in signed PDFs for authenticity
- UI styled with Tailwind CSS