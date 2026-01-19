const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const authMiddleware = require("../middlewares/auth.middleware");
const BASE_URL = process.env.BASE_URL;
require("dotenv").config();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) throw { statusCode: 400, message: "Product ID is required" };

    const db = await getDB();
    const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });
    if (!product) throw { statusCode: 404, message: "Product not found" };

    const order = await db.collection("orders").insertOne({
      userId: new ObjectId(req.user.userId),
      productId: product._id,
      amount: product.price,
      status: "pending",
      createdAt: new Date()
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: product.name },
            unit_amount: product.price * 100
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/payment-cancel`,
      metadata: { orderId: order.insertedId.toString() }
    });

    res.status(201).json({ checkoutUrl: session.url });
  } catch (err) {
    next(err);
  }
});

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      const db = await getDB();
      await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: "paid", paidAt: new Date() } }
      );
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const db = await getDB();
    const orders = await db
      .collection("orders")
      .find({ userId: new ObjectId(req.user.userId) })
      .toArray();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const db = await getDB();
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.user.userId)
    });

    if (!order) throw { statusCode: 404, message: "Order not found" };

    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
