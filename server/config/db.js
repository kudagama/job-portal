const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error("If you see an SSL/TLS error, ensure your IP address is whitelisted in MongoDB Atlas.");
    process.exit(1);
  }
};

module.exports = connectDB;