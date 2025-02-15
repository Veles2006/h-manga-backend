const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const User = new Schema(
    {
        userName: { type: String, required: true },
        email: { type: String },
        password: { type: String },
        slug: { type: String, slug: 'userName', unique: true },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        strict: false
    }
);

// Add plugin
mongoose.plugin(slug);
User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('User', User);
