// const mongoose = require('mongoose');

// const bannerSchema = new mongoose.Schema({
//     // title: { type: String, trim: true },
//     page: String,
//     mediaType: { type: String, enum: ["image", "video"] },
//     desktop: {
//         url: { type: String, required: true },
//         publicId: { type: String, required: true },
//         width: Number,
//         height: Number
//     },

//     mobile: {
//         url: { type: String, },
//         publicId: { type: String, },
//         width: Number,
//         height: Number
//     },
// }, { timestamps: true })
// module.exports = mongoose.model("Banner", bannerSchema) 
const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        page: String,
        mediaType: { type: String, enum: ["image", "video"] },

        desktop: {
            type: {
                url: { type: String, required: true },
                publicId: { type: String, required: true },
                width: Number,
                height: Number,
            },
            default: undefined, // ⭐ IMPORTANT
        },

        mobile: {
            type: {
                url: String,
                publicId: String,
                width: Number,
                height: Number,
            },
            default: undefined, // ⭐ IMPORTANT
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);


