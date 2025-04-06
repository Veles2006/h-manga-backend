const Comic = require('../models/Comic');
const Category = require('../models/Category');

async function updateCategoryCounts() {
    try {
        const categories = await Category.find();

        for (const category of categories) {
            const count = await Comic.countDocuments({ categories: category.title });
            await Category.updateOne({ _id: category._id }, { $set: { quantity: count } });
        }

        console.log('Cập nhật số lượng truyện theo thể loại thành công!');
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng truyện:', error);
    }
}

module.exports = { updateCategoryCounts };
