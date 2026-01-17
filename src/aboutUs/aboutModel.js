// models/AboutUs.js
const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
    {

        heading: {
            type: String,
            required: true,
            trim: true,
        },
        ownerName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        ownerImage: {
            url: { type: String, required: true },
            publicId: { type: String, required: true },
        },
        // aboutUsHeading: {
        //     type: String,
        //     required: true,
        // },
        // aboutUsPara: {
        //     type: String,
        //     required: true,
        // },


    },
    { timestamps: true }
);


module.exports = mongoose.model("AboutUs", aboutUsSchema);
