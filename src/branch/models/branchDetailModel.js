const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    branchName: String,
    address: String,
    contact: String,
    embedUrl: String,
    images: {
        type: [
            {
                url: String,
                publicId: String
            }
        ]
    }
}, { timestamps: true });

module.exports = mongoose.model("Branch", branchSchema)