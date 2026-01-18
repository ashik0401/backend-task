const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/error.middleware");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", require("./routes/route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/products", require("./routes/product.route"));
app.use("/orders", require("./routes/order.route"));
app.get("/payment-success", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Payment completed successfully",
    sessionId: req.query.session_id
  });
});

app.get("/payment-cancel", (req, res) => {
  res.status(200).json({
    status: "cancelled",
    message: "Payment was cancelled"
  });
});

app.use((req, res) => res.status(404).json({ status: "error", message: "Route not found" }));
app.use(errorHandler);

module.exports = app;
