const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
    image: {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
    },

    mediaType: {
        type: String,
        enum: ["image", "video"],
        default: "image",
    },




}, { timestamps: true })

module.exports = mongoose.model("Gallery", gallerySchema)