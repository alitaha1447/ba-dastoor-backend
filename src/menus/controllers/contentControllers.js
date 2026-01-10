const Content = require('../models/contentModel');

module.exports = {
    // CREATE content (ONLY if none exists)
    createContent: async (req, res) => {
        try {
            const exists = await Content.findOne();
            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: "Content already exists. You can only update or delete it.",
                });
            }
            const data = { ...req.body };
            const content = await Content.create(data);
            res.status(201).json({ success: true, data: content });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });

        }
    },
    // GET single content
    getContent: async (req, res) => {
        try {
            const content = await Content.findOne();
            res.json({ success: true, data: content });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    //  UPDATE content 
    updateContent: async (req, res) => {
        try {
            const content = await Content.findOneAndUpdate({}, req.body);
            res.json({ success: true, data: content });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    //  DELETE content 
    deleteContent: async (req, res) => {
        try {
            await Content.deleteMany(); // ensures full reset
            res.json({ success: true, message: "Content deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}