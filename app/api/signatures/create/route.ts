import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Signature from '@/models/Signature';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Verify user authentication
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { signatureHash, signatureData, metadata, personalDetails } = body;

    // Validate input
    if (!signatureHash || !signatureData || !metadata || !personalDetails) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if signature hash already exists
    const existingSignature = await Signature.findOne({ signatureHash });
    if (existingSignature) {
      // Check if it belongs to a different user
      if (existingSignature.userId !== user.userId) {
        return NextResponse.json(
          { 
            error: 'This signature is already registered to another user',
            duplicate: true,
            existingUser: existingSignature.personalDetails.fullName
          },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'You have already saved this signature',
          duplicate: true
        },
        { status: 409 }
      );
    }

    // Create signature
    const signature = await Signature.create({
      userId: user.userId,
      signatureHash,
      signatureData,
      metadata,
      personalDetails: {
        ...personalDetails,
        email: personalDetails.email || user.email,
      },
    });

    return NextResponse.json(
      {
        message: 'Signature saved successfully',
        signature: {
          id: signature._id,
          hash: signature.signatureHash,
          personalDetails: signature.personalDetails,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Save signature error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
