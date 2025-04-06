import mongoose, { Document, Schema, model } from 'mongoose';
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

// Interface cho category (dùng trong code)
export interface ICategory extends Document {
    title: string;
    description?: string;
    quantity: number;
    slug: string;
    deleteAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}   

// Schema
const CategorySchema = new Schema<ICategory>(
    {
        title: { type: String, required: true },
        description: { type: String },
        quantity: { type: Number, default: 0 },
        slug: { type: String, slug: 'title', unique: true },
        deleteAt: { type: Date, default: null }
    },
    {
        timestamps: true
    }
);

// Plugin soft delete
mongoose.plugin(slug);
CategorySchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

// Export model
export default model<ICategory>('Category', CategorySchema);