const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('--- RUNNING IN DEMO MODE (WITHOUT DATABASE) ---');
    // process.exit(1);
  }
};

module.exports = connectDB;
