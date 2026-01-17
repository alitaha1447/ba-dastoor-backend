const mongoose = require("mongoose");

const generalContentSchema = new mongoose.Schema(
    {
        page: String,
        logo: {
            url: String,
            publicId: String
        },

        heading: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },
        secondaryHeading: {
            type: String,
            trim: true
        },
        secondaryDescription: {
            type: String,
            trim: true
        },
        // mediaType: { type: String, enum: ["image", "video"] },
        // media: {
        //     url: String,
        //     publicId: String,
        //     mediaType: String,
        // }
        media: {
            url: String,
            publicId: String,
            mediaType: {
                type: String,
                enum: ["image", "video"],
            },
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("GeneralContent", generalContentSchema);
