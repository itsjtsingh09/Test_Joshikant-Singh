const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinary");
const sendEmail = require("../config/mailer"); // use sendEmail function
const { v4: uuidv4 } = require("uuid");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist)
      return res.status(400).json({ message: "Email already exists" });

    let profileImage = "";
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "profiles",
      });
      profileImage = upload.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = uuidv4();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
      isVerified: false,
      verificationCode,
    });

    const verifyLink = `${process.env.BASE_URL}/api/user/verify/${verificationCode}`;
    await sendEmail(
      email,
      "Verify your Email",
      `<h2>Hello ${name},</h2>
       <p>Click below to verify your email:</p>
       <a href="${verifyLink}">Verify Email</a>`
    );

    res.status(201).json({
      message: "User registered, check your email to verify",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { code } = req.params;
    const user = await User.findOne({ verificationCode: code });
    if (!user)
      return res.status(400).json({ message: "Invalid verification code" });

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified)
      return res.status(400).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, verifyEmail, login };
