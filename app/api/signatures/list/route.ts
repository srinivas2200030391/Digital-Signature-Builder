import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Signature from '@/models/Signature';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(req: NextRequest) {
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

    // Connect to database
    await dbConnect();

    // Get all signatures for this user
    const signatures = await Signature.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .select('-metadata.privateKey'); // Don't send private key to client

    return NextResponse.json({ 
      success: true, 
      signatures 
    });
  } catch (error: any) {
    console.error('Error fetching signatures:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch signatures' },
      { status: 500 }
    );
  }
}
