const cloudinary = require("./config/cloudinary");

// 🔥 Xóa toàn bộ ảnh và thư mục `chapters/`
const deleteFolder = async () => {
    try {
        console.log("🔍 Đang lấy danh sách ảnh trong thư mục chapters...");

        // Bước 1: Lấy danh sách tất cả ảnh trong thư mục `chapters/`
        const { resources } = await cloudinary.api.resources({
            type: "upload",
            prefix: "chapters/", // Chỉ lấy ảnh trong thư mục `chapters/`
            max_results: 500 // Giới hạn số lượng ảnh trả về
        });

        if (resources.length === 0) {
            console.log("✅ Không có ảnh nào trong thư mục chapters!");
        } else {
            // 📌 Chia danh sách ảnh thành từng nhóm 100 ảnh
            const publicIds = resources.map(file => file.public_id);
            const chunkSize = 100; // Cloudinary chỉ cho phép tối đa 100 ảnh mỗi lần
            for (let i = 0; i < publicIds.length; i += chunkSize) {
                const chunk = publicIds.slice(i, i + chunkSize);
                await cloudinary.api.delete_resources(chunk);
                console.log(`✅ Đã xóa ${chunk.length} ảnh...`);
            }
        }

        // Bước 3: Xóa thư mục `chapters/`
        await cloudinary.api.delete_folder("chapters");
        console.log("✅ Xóa thành công thư mục chapters!");

    } catch (error) {
        console.error("❌ Lỗi khi xóa thư mục chapters:", error);
    }
};

// Gọi hàm xóa
deleteFolder();