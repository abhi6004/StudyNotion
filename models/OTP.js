const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

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

// a function -> to send email
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification  Mail for StudyNotion"
    );
    console.log("mail is send Successfully", mailResponse);
  } catch (error) {
    console.log("error is come while sending a Verification Email", error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
