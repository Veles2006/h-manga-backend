const mongoose = require('mongoose');
const Comic = require('../models/Comic');
const Chapter = require('../models/Chapter');
const { mongooseToObject } = require('../utils/mongoose');
const { updateCategoryCounts } = require('../services/categoryServices');

class ComicController {
    async getAllComics(req, res, next) {
        try {
            const comics = await Comic.find();

            // Lấy chương cuối của từng truyện
            const comicsWithLastChapter = await Promise.all(
                comics.map(async (comic) => {
                    const lastChapter = await Chapter.findOne({
                        comic: comic._id,
                    }).sort({ number: -1 });
                    return {
                        ...comic.toObject(),
                        lastChapterNumber: lastChapter ? lastChapter.number : 0,
                    };
                })
            );

            // console.log(JSON.stringify(comicsWithLastChapter, null, 2));

            res.status(200).json(comicsWithLastChapter);
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

            // Lấy chương cuối cùng của từng truyện
            const hotComicsWithLastChapter = await Promise.all(
                hotComics.map(async (comic) => {
                    const lastChapter = await Chapter.findOne({
                        comic: comic._id,
                    })
                        .sort({ number: -1 })
                        .select('number'); // Lấy chương mới nhất
                    return {
                        ...comic.toObject(),
                        lastChapterNumber: lastChapter ? lastChapter.number : 0,
                    };
                })
            );

            res.json(hotComicsWithLastChapter);
        } catch (error) {
            res.status(500).send('Có lỗi xảy ra: ' + error.message);
        }
    }

    async getOnePageComic(req, res) {
        const page = parseInt(req.params.page) || 1;
        const limit = 42;
        const skip = (page - 1) * limit;

        try {
            const comics = await Comic.find().skip(skip).limit(limit);

            // Lấy tổng số truyện để tính số trang
            const totalComics = await Comic.countDocuments();
            const totalPages = Math.ceil(totalComics / limit);

            // Lấy chương cuối của từng truyện
            const comicsWithLastChapter = await Promise.all(
                comics.map(async (comic) => {
                    const lastChapter = await Chapter.findOne({
                        comic: comic._id,
                    })
                        .sort({ number: -1 })
                        .select('number'); // Lấy chương mới nhất
                    return {
                        ...comic.toObject(),
                        lastChapterNumber: lastChapter ? lastChapter.number : 0,
                    };
                })
            );

            res.json({
                comics: comicsWithLastChapter,
                page,
                totalPages,
                totalComics,
            });
        } catch (error) {
            res.status(500).send('Có lỗi xảy ra: ' + error.message);
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
                .then(() => res.redirect('/comics/comic-page'))
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

    async searchComics(req, res, next) {
        try {
            const query = req.query.q || '';
            if (!query) return res.json({ comics: [] });

            const comics = await Comic.find({
                title: { $regex: query, $options: 'i' },
            }).limit(10);

            const comicsWithLastChapter = await Promise.all(
                comics.map(async (comic) => {
                    const lastChapter = await Chapter.findOne({
                        comic: comic._id,
                    })
                        .sort({ number: -1 })
                        .select('number');

                    return {
                        ...comic.toObject(),
                        comicsWithLastChapter: lastChapter?.number || 0,
                    };
                })
            );

            res.json({ comics: comicsWithLastChapter });
        } catch (error) {
            console.error('Lỗi tìm kiếm truyện:', error);
            res.status(500).json({ message: 'Đã có lỗi khi tìm kiếm truyện' });
        }
    }
}

module.exports = new ComicController();
