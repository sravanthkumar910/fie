const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Email Transporter Config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. REGISTER & SEND OTP
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000, // 5 mins
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      html: `<h1>Your OTP is: ${otp}</h1>`,
    });

    return res.status(201).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error('RegisterUser error:', error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 2. VERIFY OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({ message: "Account verified successfully!" });
  } catch (error) {
    console.error('VerifyOTP error:', error);
    return res.status(500).json({ message: "Verification failed" });
  }
};

// 3. LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first" });

      return res.json({ _id: user._id, name: user.name, email: user.email });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: "Login error" });
  }
};
