const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//reset Password Token
exports.resetpasswordToken = async (req, res) => {
  try {
    //get email form body
    const email = req.body.email;
    //validation of email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "Your email is not Registered with us",
      });
    }

    //generate token
    const token = crypto.randomUUID();

    //update user and adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now + 5 * 60 * 1000 },
      { new: true }
    );

    //create a url
    const url = `http://localhost:3000/update-password/${token}`;

    //send email that contain a URL
    await mailSender(
      email,
      "Password Reset Link:",
      `Password Reset Link ${token}`
    );
    //return response
    return res.json({
      success: true,
      message: "Email Send Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: true,
      message: "Some thing went wrong while reset a password ",
    });
  }
};

//reset Password
exports.resetpassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;

    //validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password and ConfirmPassword is not match",
      });
    }

    //get user details 
    const userDetails = await User.findOne({ token: token });

    //if no entry - invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }

    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expire",
      });
    }

    //hash password
    const hashPassword = await bcrypt.hash(password, 10);

    //update password
    await User.findOneAndUpdate(
      { token: token },
      { password: hashPassword },
      { new: true }
    );

    //response return
    return res.status(200).json({
      success:true,
      message:"Password is change Successfully",
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Something went wrong while reset a password",
    })
  }
};
