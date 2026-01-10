const SocialLink = require('../models/socialLinksModels')

module.exports = {
    createSocial: async (req, res) => {
        try {
            const exists = await SocialLink.findOne();
            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: "Social links already exist. Use update API.",
                });
            }
            const data = { ...req.body };
            const social = await SocialLink.create(data);
            res.status(201).json({ success: true, data: social });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    getSocials: async (req, res) => {
        try {
            const socials = await SocialLink.find();
            res.status(200).json({ success: true, data: socials });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    updateSocial: async (req, res) => {
        try {
            const social = await SocialLink.findOneAndUpdate(
                {},                // single document
                req.body,          // updated links
                {
                    new: true,     // return updated doc
                    upsert: true,  // create if not exists
                    runValidators: true
                }
            );

            res.status(200).json({
                success: true,
                data: social,
                message: "Social links updated successfully",
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    },
    deleteSocial: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedSocial = await SocialLink.findByIdAndDelete(id);
            if (!deletedSocial) {
                return res.status(404).json({
                    success: false,
                    message: "Social links not found",
                });
            }


            res.status(200).json({
                success: true,
                message: "Social links deleted successfully",
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
}