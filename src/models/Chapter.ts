import { Schema, model, Document, Types } from 'mongoose';
const mongooseDelete = require('mongoose-delete');

// Giao diện định nghĩa cấu trúc chương (chapter)
export interface IChapter extends Document {
    comic: Types.ObjectId;
    number: number;
    images: string[];
    deleteAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// Định nghĩa schema
const ChapterSchema = new Schema<IChapter>(
    {
        comic: { type: Schema.Types.ObjectId, ref: 'Comic', required: true },
        number: { type: Number, required: true, unique: true },
        images: [{ type: String }],
        deleteAt: { type: Date, default: null }
    },
    {
        timestamps: true
    }
);

// Kích hoạt plugin xóa mềm
ChapterSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

// Xuất model
export default model<IChapter>('Chapter', ChapterSchema);
