const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

// In-memory storage for refresh tokens (consider using a database for production)
let refreshTokens = [];

// Sign Up Functionality
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Check Username length is more than 4
    if (username.length <= 4) {
      return res.status(400).json({
        message: "Username length should be more than 4",
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username: username });

    if (existingUsername) {
      return res.status(400).json({
        message: "Already Existing Username",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email });

    if (existingEmail) {
      return res.status(400).json({
        message: "Already Existing Email",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    // Creating New User
    const newUser = new User({
      username: username,
      email: email,
      password: hashPass,
      address: address,
    });

    await newUser.save();

    // Generate authClaims
    const authClaims = { name: newUser.username, role: newUser.role };

    // Generate tokens
    const token = jwt.sign(authClaims, "bookStore123", { expiresIn: "30m" });
    const refreshToken = jwt.sign(authClaims, "refreshSecretKey", { expiresIn: "7d" });

    // Store the refresh token in memory (or database)
    refreshTokens.push(refreshToken);

    return res.status(200).json({
      message: "User created successfully",
      token: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Sign In
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username: username });

    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    bcrypt.compare(password, existingUser.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(400).json({
          message: "Invalid Credentials",
        });
      }

      const authClaims = {
        name: existingUser.username,
        role: existingUser.role,
      };

      const token = jwt.sign(authClaims, "bookStore123", {
        expiresIn: "30m",
      });

      const refreshToken = jwt.sign(authClaims, "refreshSecretKey", {
        expiresIn: "7d",
      });

      // Store the refresh token in memory (or database)
      refreshTokens.push(refreshToken);

      return res.status(200).json({
        id: existingUser._id,
        role: existingUser.role,
        token: token,
        refreshToken: refreshToken,
        message: "SignIn Success",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Refresh Token Route
router.post("/refresh-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Refresh Token Required" });
  }

  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ message: "Invalid Refresh Token" });
  }

  jwt.verify(token, "refreshSecretKey", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    const newAuthClaims = { name: user.name, role: user.role };
    const newAccessToken = jwt.sign(newAuthClaims, "bookStore123", {
      expiresIn: "30m",
    });

    res.status(200).json({
      token: newAccessToken,
    });
  });
});

// Get User Information
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Update Address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({
      message: "Address Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
