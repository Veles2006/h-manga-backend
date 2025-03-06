const mongoose = require('mongoose');

async function connect() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb://127.0.0.1/h-manga', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('❌ Kết nối MongoDB thất bại:', error);
        process.exit(1); // Dừng chương trình nếu kết nối lỗi
    }
}

module.exports = { connect };