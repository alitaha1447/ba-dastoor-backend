const mongoose = require("mongoose")

const contentSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        trim: true,
    },
    paragraph: {
        type: String,
        required: true,
        trim: true,
    },
},
    { timestamps: true });

module.exports = mongoose.model("Content", contentSchema);
