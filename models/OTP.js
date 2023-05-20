const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    ref: "User",
    require: true,
  },
  otp: {
    type: String,
    require: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

module.exports = mongoose.model("OTP", OTPSchema);
