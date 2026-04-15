import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // Built-in Node.js module
import { sendOTP, sendResetEmail } from "../services/emailService.js";

// --- Signup Logic ---
export const signup = async (req, res) => {
  try {
    // 1. Extract firstName and lastName from the request body
    const { email, password, firstName, lastName } = req.body;

    // Optional: Basic validation to ensure names are provided
    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "First and last names are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // 2. Pass the new fields into the data object
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName, // Added
        lastName, // Added
        otp,
        otpExpires,
      },
    });

    await sendOTP(email, otp);

    res.status(201).json({
      message: "User created. Please check your email for OTP.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Verify OTP Logic ---
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      user.otp !== otp ||
      (user.otpExpires && user.otpExpires < new Date())
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpires: null,
      },
    });

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.user.update({
        where: { email },
        data: { otp: newOtp, otpExpires: otpExpiry },
      });

      await sendOTP(email, newOtp);

      return res.status(403).json({
        message: "Account not verified. A new OTP has been sent to your email.",
        notVerified: true,
        email: user.email,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, plan: user.plan },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });
    // NOman NAeem

    // // --- UPDATED: Include names in the user_data cookie ---
    // const userInfo = {
    //   email: user.email,
    //   firstName: user.firstName, // Added
    //   lastName: user.lastName, // Added
    //   plan: user.plan || "FREE",
    // };

    res.cookie("user_data", JSON.stringify(userInfo), {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: userInfo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Logout Logic ---
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // Must be true
      sameSite: "none", // Must be "none"
      path: "/",
    });
    res.clearCookie("user_data", {
      httpOnly: false,
      secure: true, // Must be true
      sameSite: "none", // Must be "none"
      path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Change Password Logic (Authenticated) ---
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    console.log("Entire Request Body:", req.body);
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const userId = req.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "Password changed successfully!" });
  } catch (error) {
    console.log("CAtch Error", error);
    res.status(500).json({ error: error.message });
  }
};

// --- Forgot Password (Request Token) ---
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Security: Don't confirm if user exists
      return res.json({
        message:
          "If an account exists with this email, a reset token has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpires },
    });

    await sendResetEmail(email, resetToken);
    // console.log(`Reset Token for ${email}: ${resetToken}`);

    res.json({ message: "Reset token sent successfully.", token: resetToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Reset Password (Using Token) ---
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() }, // Check if token is still valid
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    res.json({
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// --- get user profile logic ---
export const getProfile = async (req, res) => {
  try {
    // req.user is populated by your 'protect' middleware
    if (!req.user) return res.status(404).json({ message: "User not found" });
    const USER = {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      plan: req.user.plan,
      subscriptionStatus: req.user.subscriptionStatus,
      stripeCurrentPeriodEnd: req.user.stripeCurrentPeriodEnd,
    };
    console.log("object", USER);
    res.status(200).json({
      user: USER,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// --- Login with Google Logic ---
export const googleAuthCallback = async (req, res) => {
  try {
    // Passport attaches the user object to req.user after successful authentication
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Generate our app's JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set the cookie so the user is "logged in" for future requests
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Redirect the user back to your Frontend Dashboard
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
