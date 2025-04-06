import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function connect(): Promise<void> {
    try {
        mongoose.set('strictQuery', false);
        const uri = process.env.MONGODB_URI || '';

        if (!uri) throw new Error('❌ Thiếu biến MONGODB_URI trong .env');

        await mongoose.connect(uri);
        console.log('✅ Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('❌ Kết nối MongoDB thất bại:', error);
        process.exit(1);
    }
}

export default { connect };
