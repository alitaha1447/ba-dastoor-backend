const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    description: String,
    location: String,
    experience: String,
    status: {
        type: Boolean,
        default: true // true = Active, false = Inactive
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("Job", jobSchema)