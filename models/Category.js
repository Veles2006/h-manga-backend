const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
    {
        title: { type: String, require: true },
        description: { type: String },
        quantity: { type: Number, default: 0 },
        slug: { type: String, slug: 'title', unique: true },
        deleteAt: { type: Date, default: null }
    },
    {
        timestamps: true
    }
)

mongoose.plugin(slug);
CategorySchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Category', CategorySchema);