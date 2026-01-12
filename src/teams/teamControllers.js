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
    },
    updateTeam: async (req, res) => {
        let newPublicId = null;
        let oldPublicId = null;

        try {
            const { teamName, description, role } = req.body;

            const existing = await Team.findOne();
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: "Team not found",
                });
            }

            const updatePayload = {
                ...(teamName !== undefined && { teamName }),
                ...(description !== undefined && { description }),
                ...(role !== undefined && { role }),
            };

            if (req.file) {
                console.log("📂 Temp file created:", req.file.path);

                oldPublicId = existing.teamImage?.publicId || null;
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: "about-us",
                    quality: "auto:eco",
                    fetch_format: "auto",
                });


                newPublicId = uploadResult.public_id;

                updatePayload.teamImage = {
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                };
                console.log("☁️ Uploaded new image:", newPublicId);
            }
            const updated = await Team.findOneAndUpdate(
                {},
                { $set: updatePayload },
                { new: true }
            );
            if (oldPublicId) {
                await cloudinary.uploader.destroy(oldPublicId);
            }

            return res.status(200).json({
                success: true,
                message: "Team updated successfully",
                data: updated,
            });
        } catch (error) {
            console.error("❌ Update failed:", error.message);

            /* ROLLBACK NEW CLOUDINARY IMAGE */
            if (newPublicId) {
                await cloudinary.uploader.destroy(newPublicId);
                console.log("↩️ Rolled back new Cloudinary image:", newPublicId);
            }

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        } finally {
            if (req.file?.path) {
                try {
                    await fsPromises.unlink(req.file.path);
                    console.log("🧹 Temp file deleted:", req.file.path);
                } catch (err) {
                    console.error("❌ Temp file delete failed:", err.message);
                }
            }
        }
    },
}