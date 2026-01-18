const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      const err = new Error("All fields are required");
      err.statusCode = 400;
      throw err;
    }
    const db = getDB();
    const users = db.collection("users");
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      const err = new Error("User already exists");
      err.statusCode = 400;
      throw err;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });
    res.status(201).json({ message: "User registered successfully", id: result.insertedId });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error("Email & password required");
      err.statusCode = 400;
      throw err;
    }
    const db = getDB();
    const users = db.collection("users");
    const user = await users.findOne({ email });
    if (!user) {
      const err = new Error("Invalid credentials");
      err.statusCode = 400;
      throw err;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid credentials");
      err.statusCode = 400;
      throw err;
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const db = getDB();
    const users = db.collection("users");
    const user = await users.findOne({ _id: new ObjectId(req.user.userId) }, { projection: { password: 0 } });
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
