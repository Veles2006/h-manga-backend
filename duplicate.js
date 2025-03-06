const mongoose = require('mongoose');
const { connect } = require('./config/db'); // Import kết nối MongoDB

const Comic = mongoose.model('Comic', new mongoose.Schema({}, { strict: false })); // Model động

async function duplicateDocument(documentId, copies = 40) {
    try {
        await connect(); // Kết nối MongoDB
        console.log(`🔄 Đang nhân bản document với ID: ${documentId}`);

        // Tìm document gốc
        const originalDoc = await Comic.findById(documentId);
        if (!originalDoc) {
            console.log("⚠️ Không tìm thấy document!");
            return;
        }

        // Nhân bản 40 lần
        let newDocs = Array.from({ length: copies }, (_, index) => {
            let newDoc = originalDoc.toObject();
            delete newDoc._id; // Xóa _id cũ để tránh lỗi trùng lặp
            newDoc.slug = `${newDoc.slug}-copy-${index}-${new mongoose.Types.ObjectId().toHexString()}`;
            return newDoc;
        });

        // Chèn vào database
        const duplicatedDocs = await Comic.insertMany(newDocs);
        console.log(`✅ Đã nhân bản ${duplicatedDocs.length} documents thành công!`);
    } catch (error) {
        console.error("❌ Lỗi trong quá trình nhân bản:", error);
    } finally {
        mongoose.connection.close().then(() => console.log("🔌 Đã đóng kết nối MongoDB."));
    }
}

// Chạy chương trình với ID cụ thể
const documentId = "67c3cb9f2720e1423fd9697b"; // 👉 Đổi thành ID của document bạn muốn nhân bản
duplicateDocument(documentId);
