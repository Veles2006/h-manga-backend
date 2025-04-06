import { Request, Response, NextFunction } from "express";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

export const register = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email, password } = req.body;
  
    // 1. Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
      return;
    }
  
    // 2. Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email đã được sử dụng' });
      return;
    }
  
    // 3. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // 4. Tạo user mới
    const newUser = new User({
      email,
      password: hashedPassword,
      userName: email.split('@')[0], // Gán tên mặc định
    });
  
    await newUser.save();
  
    res.status(201).json({ message: 'Đăng ký thành công' });
  };

export const sendConfirmationCode = async (req: Request, res: Response) => {
    const { email } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    // Xóa mã cũ (nếu có)
    await VerificationCode.deleteMany({ email });

    // Lưu mã mới
    await VerificationCode.create({ email, code, expiresAt });

    // Gửi email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"H-Manga" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Mã xác nhận đăng ký',
        text: `Mã xác nhận của bạn là: ${code}`,
    });

    res.json({ message: 'Đã gửi mã xác nhận' });
};

export const verifyCode = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, code } = req.body;

        const record = await VerificationCode.findOne({ email, code });

        if (!record) {
            res.status(400).json({ message: 'Mã không đúng' });
            return;
        }

        if (record.expiresAt < new Date()) {
            res.status(400).json({ message: 'Mã đã hết hạn' });
            return;
        }

        // Xoá mã sau khi dùng
        await VerificationCode.deleteOne({ _id: record._id });

        res.json({ message: 'Xác nhận thành công' });
    } catch (error) {
        next(error); // để Express xử lý lỗi nếu có
    }
};
