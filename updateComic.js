const mongoose = require('mongoose');
const { connect } = require('./config/db'); // Import kết nối MongoDB

const Comic = mongoose.model(
    'Comic',
    new mongoose.Schema({}, { strict: false })
); // Model động

const updateComics = async () => {
    try {
        await connect(); // Kết nối MongoDB

        const result = await Comic.updateMany({}, [
            {
                $set: {
                    status: 'ongoing',
                    chapters: 0,
                    author: 'Đang cập nhật',
                    likes: 0,
                    follows: 0,
                    deleteAt: null,
                    anotherTitle: ['$title'],
                }
            },
            {
                $unset: ["chapter"] // Dùng mảng để chỉ định các trường cần xóa
            }
        ]);

        console.log(`✅ Cập nhật ${result.modifiedCount} document thành công.`);
    } catch (error) {
        console.error('❌ Lỗi cập nhật dữ liệu:', error);
    } finally {
        mongoose.connection
            .close()
            .then(() => console.log('🔌 Đã đóng kết nối MongoDB.'));
    }
};

// Chạy hàm cập nhật
updateComics();
