import mongoose, { Schema, models, Model } from 'mongoose';

export interface ISignature {
  _id: string;
  userId: string;
  signatureHash: string;
  signatureData: string;
  metadata: {
    timestamp: string;
    publicKey: string;
    privateKey: string;
    mode: string;
    strokes: any[];
  };
  personalDetails: {
    fullName: string;
    organization?: string;
    designation?: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SignatureSchema = new Schema<ISignature>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
      index: true,
    },
    signatureHash: {
      type: String,
      required: [true, 'Signature hash is required'],
      unique: true,
      index: true,
    },
    signatureData: {
      type: String,
      required: [true, 'Signature data is required'],
    },
    metadata: {
      timestamp: String,
      publicKey: String,
      privateKey: String,
      mode: String,
      strokes: [Schema.Types.Mixed],
    },
    personalDetails: {
      fullName: {
        type: String,
        required: [true, 'Full name is required'],
      },
      organization: String,
      designation: String,
      email: {
        type: String,
        required: [true, 'Email is required'],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Signature: Model<ISignature> = models.Signature || mongoose.model<ISignature>('Signature', SignatureSchema);

export default Signature;
