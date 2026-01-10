const mongoose = require("mongoose")

const dishSchema = new mongoose.Schema({
    dishName: String,
    description: String,
    fullPrice: String,
    halfPrice: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Dish", dishSchema);
