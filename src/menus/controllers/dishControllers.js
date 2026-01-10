const Dish = require("../models/dishModels");

module.exports = {
    createDish: async (req, res) => {
        try {
            const { categoryId } = req.params
            const data = { ...req.body };
            const dish = await Dish.create({ ...data, categoryId });
            res.status(201).json({ success: true, data: dish });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getDishes: async (req, res) => {
        try {
            console.log(req.params)
            const { categoryId } = req.params
            const dishes = await Dish.find({ categoryId }).sort({ createdAt: 1 });

            // const dishes = await Dish.findById();
            res.status(200).json({ success: true, data: dishes });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });

        }
    },
    updateDish: async (req, res) => {
        try {
            const dish = await Dish.findByIdAndUpdate(req?.params?.id, {
                ...req?.body,
                updatedAt: Date.now(),
            }, { new: true });
            res.status(201).json({
                message: "Dish Updated Successfully",
                data: dish,
            });

        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to update job" });
        }
    },
    deleteDish: async (req, res) => {
        try {

            const id = req?.params?.id
            const dish = await Dish.findByIdAndDelete({ _id: id })
            res.status(201).json({
                message: "Dish Deleted Successfully",
                data: dish,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

}