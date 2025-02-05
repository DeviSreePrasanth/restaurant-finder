const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { getRestaurantsByLocation } = require("./controller/LocationController");
const getRestaurantById=require("./routes/Searchroutes");
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the URI provided in the .env file
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("connected", () => console.log("MongoDB connected successfully"));
db.on("error", (err) => console.error("MongoDB connection error:", err));

const collection = db.collection("new");

// Get all restaurants (without pagination)
app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await collection.find({}).toArray();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get restaurants with pagination
app.get("/restaurants", async (req, res) => {
  try {
    let { page = 1, limit = 8 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const restaurants = await collection
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments();
    const pageCount = Math.ceil(total / limit);

    res.json({
      total,
      pageCount,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/locationR", getRestaurantsByLocation);
app.use("/restaurants",getRestaurantById)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
