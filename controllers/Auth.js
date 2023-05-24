const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerate = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//sendOTP
exports.sendOTP = async (req, res) => {
  try {
    //fetch email form user body
    const { email } = req.body;

    //check if user already exits
    const checkUserPresent = User.findOne({ email });

    //if user is already exit,than send a response
    if (checkUserPresent) {
      res.status(401).json({
        success: false,
        message: "User is already Register",
      });
    }

    //generate OTP
    let otp = otpGenerate.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP Generated", otp);

    //check unique otp or not
    // let result = await OTP.findOne({ otp: otp });

    // while (result) {
    //   otp = otpGenerate.generate(6, {
    //     upperCaseAlphabets: false,
    //     lowerCaseAlphabets: false,
    //     specialChars: false,
    //   });

    //   result = await OTP.findOne({ otp: otp });
    // }

    const otpPayload = { email, otp };

    //create a entry for OTP
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    //return a response successful
    res.status(200).json({
      success: true,
      message: "OTP send successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Signup
exports.signUp = async (req, res) => {
  try {
    //data fetch for body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //do a validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //2 password match or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirmPassword Value is not match, Please Try again",
      });
    }

    //check user is already exits or not
    const exitingUser = await User.findOne({ email });

    if (exitingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already exiting",
      });
    }

    //find most recent OTP stored in user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    //validate OTP
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "OTP is not Found",
      });
    } else if (recentOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is invalid",
      });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //entry in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
      additionalDetails: profileDetails,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //return res
    return res.status().json({
      success: true,
      message: "User is Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User Cannot be Registered,Please Try again",
    });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    //get data from req body
    const { email, password } = req.body;

    //validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "all field are required",
      });
    }

    //user check exit or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not Registered,Please SignUp First",
      });
    }

    //generate token,after password match
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user.id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      //create cookie and response
      const option = {
        expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, option).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is not match",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Logged in failure",
    });
  }
};

//changePassword
exports.changePassword = (req, res) => {
  //get data form body
  //get oldPassword, new Password, confirmPassword
  //validation
  //update password in DB
  //send mail - password is update
  //return response
};
