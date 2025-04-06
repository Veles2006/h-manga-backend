import mongoose, { Schema, model, Document } from 'mongoose';
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

// Interface cho Comic document
export interface IComic extends Document {
    title: string;
    anotherTitle: string[];
    author: string;
    description?: string;
    categories?: string[];
    coverImage: string;
    status: 'ongoing' | 'completed';
    chapters: number;
    likes: number;
    follows: number;
    views: number;
    slug: string;
    deleteAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema
const ComicSchema = new Schema<IComic>(
    {
        title: {
            type: String,
            required: true,
        },
        anotherTitle: {
            type: [String],
            default: [],
        },
        author: {
            type: String,
            default: 'Đang cập nhật',
        },
        description: {
            type: String,
        },
        categories: {
            type: [String],
        },
        coverImage: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['ongoing', 'completed'],
            default: 'ongoing',
        },
        chapters: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        follows: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        slug: {
            type: String,
            slug: 'title',
            unique: true,
            slugPaddingSize: 4,
        },
        deleteAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Plugin soft delete
ComicSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

// Xuất model
export default model<IComic>('Comic', ComicSchema);
