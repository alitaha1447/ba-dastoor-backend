const mongoose = require("mongoose");

const desktopBannerSchema = new mongoose.Schema(
    {
        page: String,
        mediaType: { type: String, enum: ["image", "video"] },

        desktop: {
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

module.exports = mongoose.model("DesktopBanner", desktopBannerSchema);

