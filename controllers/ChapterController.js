const mongoose = require('mongoose'); // Thêm dòng này vào đầu file
const Comic = require('../models/Comic');
const Chapter = require('../models/Chapter');

class ChapterController {
    // 📌 Lấy tất cả chương của một truyện
    async getChapters(req, res) {
        try {
            const { slug } = req.params;
            const comic = await Comic.findOne({ slug });

            if (!comic) {
                return res
                    .status(404)
                    .json({ message: 'Không tìm thấy truyện' });
            }

            const chapters = await Chapter.find({ comic: comic._id }).sort({
                number: -1,
            });

            // Chuyển đổi ngày tháng năm
            const formattedChapters = chapters.map((chap) => {
                const updatedAt =
                    chap.updatedAt instanceof Date
                        ? chap.updatedAt
                        : new Date(chap.updatedAt); // Đảm bảo nó là kiểu Date

                // Lấy ngày, tháng, năm với padding '0'
                const day = String(updatedAt.getDate()).padStart(2, '0'); // Đảm bảo 2 chữ số
                const month = String(updatedAt.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
                const year = updatedAt.getFullYear();

                return {
                    ...chap.toObject(),
                    updatedAt: `${day}/${month}/${year}`, // Định dạng đúng 2 chữ số
                };
            });

            res.status(200).json(formattedChapters);
        } catch (err) {
            console.error('❌ Lỗi:', err);
            res.status(500).json({ message: 'Lỗi server', err });
        }
    }

    async getChapter(req, res) {
        try {
            const { slug, chapter } = req.params;
            const chapterNumber = Number(chapter);

            const comic = await Comic.findOne({ slug });

            if (!comic) {
                return res
                    .status(404)
                    .json({ message: 'Không tìm thấy truyện' });
            }

            const chapterObject = await Chapter.findOne({
                comic: comic._id,
                number: chapterNumber,
            }).lean();

            if (!chapterObject) {
                return res
                    .status(404)
                    .json({ message: 'Không tìm thấy chương' });
            }
            res.status(200).json(chapterObject);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', err });
        }
    }

    async createChapter(req, res) {
        try {
            const { slug } = req.params;
            const { number } = req.body;

            if (!req.files || req.files.length === 0) {
                return res
                    .status(400)
                    .json({ message: 'Vui lòng tải lên ít nhất một ảnh!' });
            }

            const comic = await Comic.findOne({ slug });
            if (!comic) {
                return res
                    .status(404)
                    .json({ message: 'Không tìm thấy truyện' });
            }

            const chapterNumber = parseInt(number, 10);
            if (isNaN(chapterNumber) || chapterNumber < 0) {
                return res
                    .status(400)
                    .json({ message: 'Số chương không hợp lệ!' });
            }

            const images = req.files.map((file) => file.path);

            const chapter = new Chapter({
                comic: comic._id,
                number: chapterNumber,
                images,
            });

            await chapter.save();
            comic.chapters += 1;
            await comic.save();

            // 🛠 Chỉ gửi một response duy nhất
            res.status(201).json({
                message: 'Tạo chương thành công!',
                chapter,
            });

            // Nếu cần chuyển hướng, hãy để frontend xử lý!
        } catch (err) {
            console.error('Lỗi server:', err);
            res.status(500).json({ message: 'Có lỗi xảy ra' });
        }
    }
}

module.exports = new ChapterController();
