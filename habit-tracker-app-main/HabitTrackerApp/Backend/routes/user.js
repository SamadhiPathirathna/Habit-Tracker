const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const User = require("../models/user");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; // Use secret from .env

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profilePictures"); // Set upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({ storage: storage });

// Password validation function
function isPasswordValid(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = user.userId;
    next();
  });
}

// Register route with profile picture upload and password validation
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { username, password, name, age, gender, lifestyle } = req.body;

  // Validate password
  if (!isPasswordValid(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character."
    });
  }

  try {
    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Get profile picture path if uploaded
    const profilePicture = req.file ? req.file.path : null;

    // Create new user
    const newUser = new User({ username, password, name, age, gender, lifestyle, profilePicture });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid username or password" });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid username or password" });

    // Generate a token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
});

// Get user profile route
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.userId).select("-password"); // Exclude password field
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve profile" });
  }
});

// Update profile route
router.put("/update/profile", authenticateToken, upload.single("profilePicture"), async (req, res) => {
  const { name, age, gender, lifestyle } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update profile details
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (lifestyle) user.lifestyle = lifestyle;

    // Update profile picture if a new one is uploaded
    if (req.file) {
      user.profilePicture = req.file.path;
    }

    // Save the updated user profile
    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
