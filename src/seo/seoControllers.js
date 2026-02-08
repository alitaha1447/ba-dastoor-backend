const SEO = require('./seoModel');

module.exports = {
    createSEO: async (req, res) => {
        try {
            const { title, description, slug, pageType } = req.body;
            if (!title || !description || !slug || !pageType) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const existing = await SEO.findOne({ slug });
            if (existing) {
                return res.status(409).json({ message: "Slug already exists" });
            }

            const seo = await SEO.create({
                title,
                description,
                slug,
                pageType
            });

            res.status(201).json({
                success: true,
                data: seo,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAllSEO: async (req, res) => {
        try {
            const seoData = await SEO.find().sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                count: seoData.length,
                data: seoData,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getSEOByPageType: async (req, res) => {
        try {
            const { pageType } = req.params;
            const seo = await SEO.findOne({ pageType });


            if (!seo || seo.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No SEO found for this page type",
                });
            }

            res.json({ success: true, data: seo });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateSEO: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, slug, pageType } = req.body;

            // ✅ Basic validation
            if (!title || !description || !slug || !pageType) {
                return res.status(400).json({
                    message: "All fields are required",
                });
            }

            // Check slug duplicate except current id
            const existing = await SEO.findOne({
                slug,
                _id: { $ne: id },
            });

            if (existing) {
                return res.status(409).json({
                    message: "Slug already exists",
                });
            }
            const seo = await SEO.findByIdAndUpdate(
                id,
                {
                    title,
                    description,
                    slug,
                    pageType,        // 👈 added
                },
                { new: true, runValidators: true }
            );

            if (!seo) {
                return res.status(404).json({ message: "SEO not found" });
            }

            res.json({ success: true, data: seo });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteSEO: async (req, res) => {
        try {
            const { id } = req.params;

            await SEO.findByIdAndDelete(id);
            res.json({ success: true, message: "SEO deleted" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}