const mongoose = require('mongoose');
const { connect } = require('./config/db'); // Import kết nối MongoDB

const Comic = mongoose.model('Comic', new mongoose.Schema({}, { strict: false })); // Model động

async function deleteDocument() {
    try {
        await connect(); // Kết nối MongoDB
        console.log("🔄 Đang xóa documents...");

        const result = await Comic.deleteMany({ slug: /-copy-/ });
        console.log(`✅ Đã xóa ${result.deletedCount} documents.`);
    } catch (error) {
        console.error("❌ Lỗi khi xóa documents:", error);
    } finally {
        mongoose.connection.close().then(() => console.log("🔌 Đã đóng kết nối MongoDB."));
    }
}


deleteDocument();