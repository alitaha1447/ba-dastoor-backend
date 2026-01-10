const mongoose = require("mongoose");

const mobileBannerSchema = new mongoose.Schema(
    {
        page: String,
        mediaType: { type: String, enum: ["image", "video"] },


        mobile: {
            url: String,
            publicId: String,
            mediaType: String,
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("MobileBanner", mobileBannerSchema);

