import { Request, Response, NextFunction } from 'express';
import User from '@/models/User';
const { mutipleMongooseToObject } = require('../utils/mongoose');

class SiteController {
    // [GET] /
    home(req: Request, res: Response, next: NextFunction): void {
        User.find({})
            .then((users) => {
                res.render('home', {
                    users: mutipleMongooseToObject(users),
                });
            })
            .catch(next);
    }

    // [GET] /users
    async users(req: Request, res: Response): Promise<void> {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            console.error('❌ Error fetching users:', error);
            res.status(500).json({ message: 'Error fetching users', error });
        }
    }
}

export default new SiteController();

