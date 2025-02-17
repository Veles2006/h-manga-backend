const mongoose = require('mongoose');
const Comic = require('../models/Comic');
const { mongooseToObject } = require('../utils/mongoose');

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
            const comic = new Comic(req.body);
            comic
                .save()
                .then(() => res.redirect('/comic'))
                .catch((error) => {
                    console.error('Lỗi khi lưu truyện:', error);
                    res.status(500).json({ message: 'Lưu truyện thất bại' });
                });
        } catch (err) {
            console.error('Lỗi server:', err);
            res.status(500).json({ message: 'Có lỗi xảy ra' });
        }
    }
}

module.exports = new ComicController();
