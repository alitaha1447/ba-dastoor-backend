// const mongoose = require("mongoose");

// const imageSchema = new mongoose.Schema(
//     {
//         url: { type: String, required: true },
//         publicId: { type: String, required: true },
//     },
//     { _id: false }
// );

// const gallerySchema = new mongoose.Schema({
//     primaryImage: {
//         type: imageSchema,
//         required: true,
//     },
//     siblings: {
//         type: [imageSchema],
//         default: [],
//     },
//     mediaType: {
//         type: String,
//         enum: ["image"],
//         default: "image",
//     },
// }, { timestamps: true });

// module.exports = mongoose.model("NewGallery", gallerySchema);
const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
    {
        primaryImage: {
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

module.exports = mongoose.model("NewGallery", gallerySchema);
