const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');


const ChapterSchema = new mongoose.Schema({
    comic: { type: mongoose.Schema.Types.ObjectId, ref: 'Comic', required: true },
    number: { type: Number, required: true, unique: true },
    images: [String], // Danh sách ảnh của chương
    deleteAt: { type: Date, default: null },

}, { timestamps: true });

ChapterSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Chapter', ChapterSchema);