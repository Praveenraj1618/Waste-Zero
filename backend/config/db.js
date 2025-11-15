// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  }
};
