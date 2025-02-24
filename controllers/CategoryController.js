const mongoose = require('mongoose');
const Category = require('../models/Category');
const { mongooseToObject } = require('../utils/mongoose');

class CategoryController {
    async getAllCategories(req, res, next) {
        try {
            const categories = await Category.find().sort({ title: 1 });
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Error server', error });
        }
    }

    async createCategory(req, res, next) {
        try {
            const { title, description } = req.body;

            const category = new Category({
                title,
                description
            });

            const saveCategory = await category.save();

            res.status(201).json(saveCategory);
        } catch (err) {
            console.log('Lỗi khi lưu thể loại: ', err);
            
            res.status(500).json({ err: 'Không thể lưu thể loại' })
        }
    }
}

module.exports = new CategoryController();
