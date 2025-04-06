import { Schema, model, Document } from 'mongoose';

export interface IVerificationCode extends Document {
    email: string;
    code: string;
    createdAt: Date;
    expiresAt: Date;
}

const VerificationCodeSchema = new Schema<IVerificationCode>({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
});

export default model<IVerificationCode>('VerificationCode', VerificationCodeSchema);
