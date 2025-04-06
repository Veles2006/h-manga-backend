import { Request, Response } from 'express';
import Comic from '@/models/Comic';
import Chapter from '@/models/Chapter';
const { updateCategoryCounts } = require('../services/categoryServices');

class ComicController {
    async getAllComics(req: Request, res: Response): Promise<void> {
        try {
            const comics = await Comic.find();

            const comicsWithLastChapter = await Promise.all(
                comics.map(async (comic) => {
                    const lastChapter = await Chapter.findOne({ comic: comic._id }).sort({ number: -1 });
                    return {
                        ...comic.toObject(),
                        lastChapterNumber: lastChapter?.number || 0,
                    };
                })
            );

            res.status(200).json(comicsWithLastChapter);
        } catch (error) {
            console.error('❌ getAllComics error:', error);
            res.status(500).json({ message: 'Error server', error });
        }
    }

    async getHotComics(req: Request, res: Response): Promise<void> {
        try {
            const hotComics = await Comic.find()
                .sort({ views: -1, updatedAt: -1 })
                .limit(10);

            const hotComicsWithLastChapter = await Promise.all(
                hotComics.map(async (comic) => {
                    const lastChapter = await Chapter.findOne({ comic: comic._id })
                        .sort({ number: -1 })
                        .select('number');
                    return {
                        ...comic.toObject(),
                        lastChapterNumber: lastChapter?.number || 0,
                    };
                })
            );

            res.status(200).json(hotComicsWithLastChapter);
        } catch (error) {
            console.error('❌ getHotComics error:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra', error });
        }
    }

    async getOnePageComic(req: Request, res: Response): Promise<void> {
        const page = parseInt(req.params.page, 10) || 1;
        const limit = 42;
        const skip = (page - 1) * limit;

        try {
            const comics = await Comic.find().skip(skip).limit(limit);
            const totalComics = await Comic.countDocuments();
            const totalPages = Math.ceil(totalComics / limit);

            const comicsWithLastChapter = await Promise.all(
                comics.map(async (comic) => {
                    const lastChapter = await Chapter.findOne({ comic: comic._id })
                        .sort({ number: -1 })
                        .select('number');
                    return {
                        ...comic.toObject(),
                        lastChapterNumber: lastChapter?.number || 0,
                    };
                })
            );

            res.status(200).json({
                comics: comicsWithLastChapter,
                page,
                totalPages,
                totalComics,
            });
        } catch (error) {
            console.error('❌ getOnePageComic error:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra', error });
        }
    }

    async getComic(req: Request, res: Response): Promise<void> {
        try {
            const { slug } = req.params;
            const comic = await Comic.findOne({ slug });

            if (!comic) {
                res.status(404).json({ message: 'Không tìm thấy truyện' });
                return;
            }

            res.status(200).json(comic);
        } catch (error) {
            console.error('❌ getComic error:', error);
            res.status(500).json({ message: 'Error server', error });
        }
    }

    async createComic(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file as Express.Multer.File;

            if (!file) {
                res.status(400).json({ message: 'Vui lòng tải lên ảnh bìa' });
                return;
            }

            const categories = JSON.parse(req.body.categories || '[]');

            const comic = new Comic({
                ...req.body,
                categories,
                coverImage: file.path,
            });

            await comic.save();
            await updateCategoryCounts();

            res.status(201).json({ message: 'Tạo truyện thành công', comic });
        } catch (error) {
            console.error('❌ createComic error:', error);
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }

    async searchComics(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query.q as string || '';
            if (!query.trim()) {
                res.status(200).json({ comics: [] });
                return;
            }

            const comics = await Comic.find({
                title: { $regex: query, $options: 'i' },
            }).limit(10);

            const comicsWithLastChapter = await Promise.all(
                comics.map(async (comic) => {
                    const lastChapter = await Chapter.findOne({ comic: comic._id })
                        .sort({ number: -1 })
                        .select('number');

                    return {
                        ...comic.toObject(),
                        lastChapterNumber: lastChapter?.number || 0,
                    };
                })
            );

            res.status(200).json({ comics: comicsWithLastChapter });
        } catch (error) {
            console.error('❌ searchComics error:', error);
            res.status(500).json({ message: 'Đã có lỗi khi tìm kiếm truyện', error });
        }
    }
}

export default new ComicController();
