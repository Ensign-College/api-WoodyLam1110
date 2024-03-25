const express = require("express");
const Redis = require("redis");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const Ajv = require("ajv");
const { addOrder, getOrder } = require("./services/orderservice.js");
const { addOrderItem, getOrderItem } = require("./services/orderItems");

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors({origin: "http://localhost:3000"}));

// Redis client setup (ensure this URL is correctly configured for AWS)
const redisClient = Redis.createClient({
  url: process.env.REDIS_HOST, // Use environment variable for Redis host
});
redisClient.connect();

// JSON schema validation setup
const orderItemSchema = JSON.parse(fs.readFileSync("./orderItemSchema.json", "utf8"));
const ajv = new Ajv();
const validate = ajv.compile(orderItemSchema);

// Order routes
app.post("/orders", async (req, res) => {
  let order = req.body;
  let responseStatus = order.productQuantity && order.ShippingAddress ? 200 : 400;

  if (responseStatus === 200) {
    try {
      await addOrder({ redisClient, order });
      res.status(200).json({ message: "Order created successfully", order: order });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(responseStatus).send(`Missing one of the following fields: ${order.productQuantity ? "" : "productQuantity"} ${order.ShippingAddress ? "" : "ShippingAddress"}`);
  }
});

app.get("/orders/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await getOrder({ redisClient, orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Order items routes
app.post("/orderItems", async (req, res) => {
  const valid = validate(req.body);
  if (!valid) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  try {
    const orderItemId = await addOrderItem({ redisClient, orderItem: req.body });
    res.status(201).json({ orderItemId, message: "Order item added successfully" });
  } catch (error) {
    console.error("Error adding order item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/orderItems/:orderItemId", async (req, res) => {
  try {
    const orderItemId = req.params.orderItemId;
    const orderItem = await getOrderItem({ redisClient, orderItemId });
    res.json(orderItem);
  } catch (error) {
    console.error("Error getting order item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export the app for serverless-http
module.exports = app;
