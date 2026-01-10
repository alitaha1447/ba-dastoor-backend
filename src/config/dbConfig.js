const mongoose = require('mongoose');
require('dotenv').config();



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            autoIndex: true,
        });
        console.log('MongoDB connected successfully ✅');
    } catch (error) {
        console.error('MongoDB connection failed ❌', error.message);
        process.exit(1); // stop app if DB fails
    }
};


module.exports = connectDB