const fsPromises = require("fs/promises");

const cleanupTempFiles = async (err, req, res, next) => {
    try {
        const paths = [];

        if (req.files) {
            const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();

            for (const f of files) {
                if (f?.path) paths.push(f.path);
            }

            await Promise.all(
                paths.map(async (p) => {
                    try {
                        await fsPromises.unlink(p);
                        console.log("🧹 Global cleanup:", p);
                    } catch (e) {
                        if (e.code !== "ENOENT") {
                            console.error("❌ Cleanup failed:", e.message);
                        }
                    }
                })
            )
        }
    } catch (error) {
        console.error("❌ Cleanup middleware error:", error.message);
    }
    next(err);
}

module.exports = cleanupTempFiles