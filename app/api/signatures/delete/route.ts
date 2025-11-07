import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Signature from '@/models/Signature';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function DELETE(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get signature ID from request body
    const body = await req.json();
    const { signatureId } = body;

    if (!signatureId) {
      return NextResponse.json({ error: 'Signature ID is required' }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Find and delete the signature, but only if it belongs to the user
    const signature = await Signature.findOneAndDelete({ 
      _id: signatureId,
      userId: decoded.userId 
    });

    if (!signature) {
      return NextResponse.json({ 
        error: 'Signature not found or unauthorized' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Signature deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting signature:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete signature' },
      { status: 500 }
    );
  }
}
