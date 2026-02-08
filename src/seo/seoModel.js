const mongoose = require("mongoose");
const seoSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        slug: String,
        pageType: String,
    },
    { timestamps: true }
);



module.exports = mongoose.model("SEO", seoSchema);
