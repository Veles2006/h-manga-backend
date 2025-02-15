const User = require('../models/User');
const { mutipleMongooseToObject } = require('../utils/mongoose');

class SiteController {
    // [GET] / 
    home(req, res, next) {
        User.find({})
            .then((users) => {
                res.render('home', {
                    users: mutipleMongooseToObject(users),
                });
            })
            .catch(next);
    }

    async users(req, res) {
        try {
            const users = await User.find();  // Tìm tất cả người dùng trong MongoDB
            res.json(users);  // Trả về dữ liệu dưới dạng JSON
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users' });  // Nếu có lỗi, trả về mã lỗi 500
        }
    }
}

module.exports = new SiteController();
