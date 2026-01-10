const Team = require('./teamModel');
const cloudinary = require('../config/cloudinary')
const fsPromises = require("fs/promises");

module.exports = {
    createTeam: async (req, res) => {
        const tempPaths = []; // 🔴 track temp files
        try {
            const { teamName, description, role } = req.body;
            tempPaths.push(req.file.path);

            const uploadResult = await cloudinary.uploader.upload(
                req.file.path,
                { folder: "team" }
            );
            const exists = await Team.findOne();
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: "Team already exists",
                });
            }

            const team = await Team.create({
                teamName,
                description,
                role,
                teamImage: {
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                },
            });
            res.status(201).json({
                success: true,
                message: "About Us created successfully",
                data: team,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        } finally {
            await Promise.all(
                tempPaths.map(async (filePath) => {
                    try {
                        await fsPromises.unlink(filePath);
                        console.log("🧹 Temp file deleted:", filePath);
                    } catch (err) {
                        console.error("❌ Failed to delete temp file:", filePath, err.message);
                    }
                })
            );
        }
    },
    getTeam: async (req, res) => {
        try {
            const team = await Team.findOne();

            res.status(200).json({
                success: true,
                data: team,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}