import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Signature from '@/models/Signature';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { signatureHash } = body;

    if (!signatureHash) {
      return NextResponse.json(
        { error: 'Signature hash is required' },
        { status: 400 }
      );
    }

    // Check if signature exists
    const existingSignature = await Signature.findOne({ signatureHash });
    
    if (existingSignature) {
      return NextResponse.json({
        exists: true,
        message: 'This signature is already registered',
        owner: existingSignature.personalDetails.fullName,
        email: existingSignature.personalDetails.email,
      });
    }

    return NextResponse.json({
      exists: false,
      message: 'Signature is unique and can be used',
    });
  } catch (error: any) {
    console.error('Check signature error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
