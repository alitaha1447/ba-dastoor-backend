const Category = require("../models/categoryModels");

module.exports = {
    // create a category
    createCategory: async (req, res) => {
        try {
            const { categoryName } = req.body;
            const category = await Category.create({ categoryName });
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    },
    // get all categories
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find().sort({ createdAt: 1 });
            res.json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    // get category with dishes
    getCategoryWithDishes: async (req, res) => {
        try {
            const data = await Category.aggregate([
                {
                    $lookup: {
                        from: "dishes",
                        localField: "_id",
                        foreignField: "categoryId",
                        as: "dishes",
                    }
                }
            ])
            res.status(200).json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    // update category
    updateCategory: async (req, res) => {
        try {
            const category = await Category.findByIdAndUpdate(req?.params?.id, {
                ...req?.body,
                updatedAt: Date.now(),
            }, { new: true });
            res.status(201).json({
                message: "Category Updated Successfully",
                data: category,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to update category" });
        }
    },
}