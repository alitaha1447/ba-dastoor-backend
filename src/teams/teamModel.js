const mongoose = require("mongoose");
const teamSchema = new mongoose.Schema(
    {


        teamName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        teamImage: {
            url: { type: String, required: true },
            publicId: { type: String, required: true },
        },

        role: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model("Team", teamSchema);
