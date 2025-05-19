const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:/PaymentGateWayTwo");
    console.log("✅ Connected to MongoDB");

  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
  }
};

module.exports = ConnectDB;
