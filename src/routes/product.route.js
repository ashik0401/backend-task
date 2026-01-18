const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) {
      const err = new Error("Name and price are required");
      err.statusCode = 400;
      throw err;
    }
    const db = getDB();
    const result = await db.collection("products").insertOne({
      name,
      description: description || "",
      price,
      createdAt: new Date()
    });
    res.status(201).json({ message: "Product created", id: result.insertedId });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const db = getDB();
    const products = await db.collection("products").find({}).toArray();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const db = getDB();
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const db = getDB();
    const { name, description, price } = req.body;
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, description, price } }
    );
    if (result.matchedCount === 0) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }
    res.json({ message: "Product updated" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const db = getDB();
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
