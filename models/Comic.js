const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const ComicSchema = new Schema(
    {
        title: { type: String, require: true }, // Comic name
        description: { type: String }, // Comic description
        categories: { type: Array }, // Comic description
        coverImage: { type: String, require: true }, // Cover image URL
        status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
        slug: { type: String, slug: 'title', unique: true },
        deleteAt: { type: Date, default: null } 
    },
    {
        timestamps: true
    }
)

mongoose.plugin(slug);
ComicSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Comic', ComicSchema);