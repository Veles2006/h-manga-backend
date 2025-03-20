const mongoose = require('mongoose');

async function connect() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb+srv://anhphiax147x:NeN2Jb2Q9XJXLkNo@h-manga.3lv4l.mongodb.net/h-manga', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('❌ Kết nối MongoDB thất bại:', error);
        process.exit(1); // Dừng chương trình nếu kết nối lỗi
    }
}

module.exports = { connect }
