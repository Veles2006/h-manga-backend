const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const ComicSchema = new Schema(
    {
        title: {
            type: String,
            required: true, // Tên truyện (Bắt buộc)
        },
        anotherTitle: {
            type: [String],
            default: function () {
                return [this.title]; // ✅ Lấy giá trị của title
            },
        },
        author: {
            type: String,
            default: 'Đang cập nhật',
        },
        description: {
            type: String, // Mô tả truyện
        },
        categories: {
            type: [String], // Danh sách thể loại (mảng String)
        },
        coverImage: {
            type: String,
            required: true, // Ảnh bìa truyện (Bắt buộc)
        },
        status: {
            type: String,
            enum: ['ongoing', 'completed'], // Trạng thái: "Đang cập nhật" hoặc "Hoàn thành"
            default: 'ongoing',
        },
        chapters: {
            type: Number,
            default: 0, // Số lượng chương
        },
        likes: {
            type: Number,
            default: 0, // Số lượt thích
        },
        follows: {
            type: Number,
            default: 0, // Số lượt theo dõi
        },
        views: {
            type: Number,
            default: 0, // Số lượt xem
        },
        slug: {
            type: String,
            unique: true, // Đường dẫn SEO-friendly
        },
        deleteAt: {
            type: Date,
            default: null, // Ngày xóa (soft delete)
        },
    },
    {
        timestamps: true,
    }
);

mongoose.plugin(slug);
ComicSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Comic', ComicSchema);
