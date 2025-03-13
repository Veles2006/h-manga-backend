const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary');

// Cấu hình lưu trữ ảnh lên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'comics', // Tên thư mục trên Cloudinary
        format: async (req, file) => 'png', // Định dạng ảnh (tùy chọn)
        public_id: (req, file) => file.originalname.split('.')[0], // Tên file trên Cloudinary
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
