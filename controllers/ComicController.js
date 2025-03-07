const mongoose = require('mongoose');
const Comic = require('../models/Comic');
const { mongooseToObject } = require('../utils/mongoose');
const { updateCategoryCounts } = require('../services/categoryServices');

class ComicController {
    async getAllComics(req, res, next) {
        try {
            const comics = await Comic.find();
            res.status(200).json(comics);
        } catch (error) {
            res.status(500).json({ message: 'Error server', error });
        }
    }

    async getHotComics(req, res, next) {
        try {
            // Tìm truyện có lượt xem cao nhất hoặc vừa mới cập nhật
            const hotComics = await Comic.find()
                .sort({ views: -1, updatedAt: -1 }) // Sắp xếp theo lượt xem giảm dần và thời gian cập nhật gần nhất
                .limit(10); // Lấy 10 truyện hot nhất

            res.json(hotComics);
        } catch (error) {
            res.status(500).send('Có lỗi xảy ra: ' + error.message); // Thêm chi tiết lỗi
        }
    }

    async getOnePageComic(req, res) {
        const page = parseInt(req.params.page) || 1; // Lấy trang từ URL
        const limit = 42; // Mỗi trang sẽ hiển thị 42 truyện
        const skip = (page - 1) * limit; // Bỏ qua số lượng truyện đã có ở các trang trước

        try {
            const comics = await Comic.find()
                .skip(skip) // Bỏ qua số lượng truyện đã hiển thị
                .limit(limit); // Chỉ lấy 42 truyện trên trang này

            const totalComics = await Comic.countDocuments(); // Đếm tổng số truyện trong cơ sở dữ liệu
            const totalPages = Math.ceil(totalComics / limit); // Tính số trang

            res.json({
                comics,
                page,
                totalPages,
                totalComics,
            });
        } catch (error) {
            res.status(500).send('Có lỗi xảy ra: ' + error.message); // Thêm chi tiết lỗi
        }
    }

    async getComic(req, res, next) {
        try {
            const { slug } = req.params;
            const comic = await Comic.findOne({ slug });

            if (!comic) {
                return res
                    .status(404)
                    .json({ message: 'Không tìm thấy truyện' });
            }
            res.status(200).json(comic);
        } catch (error) {
            res.status(500).json({ message: 'Error server', error });
        }
    }

    async createComic(req, res, next) {
        try {
            console.log(req.file);
            // Kiểm tra xem có file ảnh không
            if (!req.file) {
                return res
                    .status(400)
                    .json({ message: 'Vui lòng tải lên ảnh bìa' });
            }

            // Chuyển đổi categories từ chuỗi JSON về mảng
            const categories = JSON.parse(req.body.categories);

            const comic = new Comic({
                ...req.body,
                categories,
                coverImage: req.file.path,
            });
            await comic
                .save()
                .then(() => res.redirect('/comics'))
                .catch((error) => {
                    console.error('Lỗi khi lưu truyện:', error);
                    res.status(500).json({ message: 'Lưu truyện thất bại' });
                });
            await updateCategoryCounts();
        } catch (err) {
            console.error('Lỗi server:', err);
            res.status(500).json({ message: 'Có lỗi xảy ra' });
        }
    }
}

module.exports = new ComicController();
