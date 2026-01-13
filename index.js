const express = require('express')
const cors = require('cors')
require('dotenv').config()
const path = require("path");
const connectDB = require('./src/config/dbConfig.js')

const jobRoutes = require('./src/jobs/jobRoutes.js')
const desktopBannerRoutes = require('./src/banners/desktopBanner/desktopRoutes.js')
const mobileBannerRoutes = require('./src/banners/mobileBanner/mobileRoutes.js')
const enquiryRoutes = require('./src/enquiry/enquiryRoutes.js')
const branchRoutes = require('./src/branch/routes/branchRoutes.js')
const contentRoutes = require('./src/menus/routes/contentRoutes.js')
const categoryRoutes = require('./src/menus/routes/categoryRoutes.js')
const dishRoutes = require('./src/menus/routes/dishRoutes.js')
const socialRoutes = require('./src/socialMedia/routes/socialLinksRoutes.js')
const newGalleryRoutes = require('./src/gallery/newGallery/galleryRoutes.js')
const newGalleryVideoRoutes = require('./src/gallery/newGalleryVideos/galleryVideoRoutes.js')
const aboutUsRoutes = require('./src/aboutUs/aboutRoute.js')
const generalContentRoutes = require('./src/content/contentRoutes.js')
const teamRoutes = require('./src/teams/teamRoutes.js')

const app = express()
const port = process.env.PORT || 3000

// 👇 ADD THIS
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


/* -------------------- DATABASE -------------------- */

connectDB();

/* -------------------- MIDDLEWARE -------------------- */

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://ba-dastoor-gilt.vercel.app'],
    credentials: true
}));

/* -------------------- ROUTES -------------------- */


app.use("/api/jobs", jobRoutes);
app.use("/api/banners", desktopBannerRoutes);
app.use("/api/banners/mobile", mobileBannerRoutes);
app.use("/api/enquirys", enquiryRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/socialLinks", socialRoutes);
app.use("/api/newGalleryImg", newGalleryRoutes)
app.use("/api/newGalleryVideo", newGalleryVideoRoutes)
app.use("/api/aboutUs", aboutUsRoutes)
app.use("/api/generalContent", generalContentRoutes)
app.use("/api/team", teamRoutes)



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "OK" });
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});


