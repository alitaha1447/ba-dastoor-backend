const mongoose = require("mongoose");

const galleryVideoSchema = new mongoose.Schema(
    {
        primaryVideo: {
            url: { type: String, required: true },
            publicId: { type: String, required: true },
        },

        siblings: {
            type: [
                {
                    slot: {
                        type: String,
                        enum: ["sibling1", "sibling2", "sibling3", "sibling4", "sibling5"],
                        required: true,
                    },
                    url: { type: String, required: true },
                    publicId: { type: String, required: true },
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("NewGalleryVideo", galleryVideoSchema);
