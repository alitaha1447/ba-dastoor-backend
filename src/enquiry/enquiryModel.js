const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
    enquiryType: { type: String, enum: ["contact", "catering", "franchise", "career"], required: true },
    // Common fields
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    message: { type: String, trim: true },
    // Franchise
    city: String,
    // Catering
    eventType: String,
    eventDate: Date,
    guests: String,
    location: String,
    // Career
    position: String,
    experience: String,

    // },
}, { timestamps: true });

module.exports = mongoose.model("Enquiry", enquirySchema);