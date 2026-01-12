const mongoose = require("mongoose");

const mobileBannerSchema = new mongoose.Schema(
    {
        page: String,
        mediaType: { type: String, enum: ["image", "video"] },


        mobile: {
            url: String,
            publicId: String,
            mediaType: String,
        },
        // ✅ Controls visibility on frontend
        isSelected: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("MobileBanner", mobileBannerSchema);

