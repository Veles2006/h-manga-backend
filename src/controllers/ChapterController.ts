import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Comic from '@/models/Comic';
import Chapter from '@/models/Chapter';

class ChapterController {
    // 📌 Lấy tất cả chương của một truyện
    async getChapters(req: Request, res: Response): Promise<void> {
        const { slug } = req.params;

        try {
            const comic = await Comic.findOne({ slug });
            if (!comic) {
                res.status(404).json({ message: 'Không tìm thấy truyện' });
                return;
            }

            const chapters = await Chapter.find({ comic: comic._id }).sort({ number: -1 });

            const formatted = chapters.map((chap) => {
                const rawDate = chap.updatedAt ?? new Date(); // fallback nếu null/undefined
                const updatedAt = new Date(rawDate);

                const day = String(updatedAt.getDate()).padStart(2, '0');
                const month = String(updatedAt.getMonth() + 1).padStart(2, '0');
                const year = updatedAt.getFullYear();

                return {
                    ...chap.toObject(),
                    updatedAt: `${day}/${month}/${year}`,
                };
            });

            res.status(200).json(formatted);
        } catch (error) {
            console.error('❌ getChapters error:', error);
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }

    // 📌 Lấy một chương cụ thể
    async getChapter(req: Request, res: Response): Promise<void> {
        const { slug, chapter } = req.params;

        try {
            const chapterNumber = Number(chapter);
            if (isNaN(chapterNumber)) {
                res.status(400).json({ message: 'Số chương không hợp lệ' });
                return;
            }

            const comic = await Comic.findOne({ slug });
            if (!comic) {
                res.status(404).json({ message: 'Không tìm thấy truyện' });
                return;
            }

            const chapterDoc = await Chapter.findOne({
                comic: comic._id,
                number: chapterNumber,
            }).lean();

            if (!chapterDoc) {
                res.status(404).json({ message: 'Không tìm thấy chương' });
                return;
            }

            res.status(200).json(chapterDoc);
        } catch (error) {
            console.error('❌ getChapter error:', error);
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }

    // 📌 Tạo chương mới
    async createChapter(req: Request, res: Response): Promise<void> {
        const { slug } = req.params;
        const { number } = req.body;

        try {
            const files = req.files as Express.Multer.File[]; // an toàn hơn
            if (!files || files.length === 0) {
                res.status(400).json({ message: 'Vui lòng tải lên ít nhất một ảnh!' });
                return;
            }

            const comic = await Comic.findOne({ slug });
            if (!comic) {
                res.status(404).json({ message: 'Không tìm thấy truyện' });
                return;
            }

            const chapterNumber = parseInt(number, 10);
            if (isNaN(chapterNumber) || chapterNumber < 0) {
                res.status(400).json({ message: 'Số chương không hợp lệ!' });
                return;
            }

            const images = files.map((file) => file.path);

            const chapter = new Chapter({
                comic: comic._id,
                number: chapterNumber,
                images,
            });

            await chapter.save();
            comic.chapters += 1;
            await comic.save();

            res.status(201).json({
                message: 'Tạo chương thành công!',
                chapter,
            });
        } catch (error) {
            console.error('❌ createChapter error:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra', error });
        }
    }
}

export default new ChapterController();
