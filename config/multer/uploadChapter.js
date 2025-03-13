const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");

// Cấu hình lưu trữ ảnh lên Cloudinary cho Chapter
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "chapters", // 📌 Lưu vào thư mục "chapters"
        format: async () => "png", // Định dạng ảnh (tùy chọn)
        public_id: (req, file) => `chapter-${Date.now()}-${file.originalname.split(".")[0]}`, // Tránh trùng lặp tên
    },
});

const uploadChapter = multer({ storage });

module.exports = uploadChapter;
