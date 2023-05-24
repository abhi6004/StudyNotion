const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer", "");

    //if token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    //verify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.json(401).json({
      success: false,
      message: "Some thing want wrong while validating a token",
    });
  }
};

//isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "this is a protected routes for student",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: "false",
      message,
    });
  }
};

//isInstructor
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "this is a protected routes for student",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: "false",
      message,
    });
  }
};

//isAdmin
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "this is a protected routes for student",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: "false",
      message,
    });
  }
};
