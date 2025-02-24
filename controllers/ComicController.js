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
