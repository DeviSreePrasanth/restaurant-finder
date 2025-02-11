const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { getRestaurantsByLocation } = require("./controller/LocationController");
const getRestaurantById = require("./routes/SearchRoutes");
const imageSearchRoutes = require("./routes/imageSearchRoutes");
const restaurantroutes = require("./routes/RestaurantRoutes"); 

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

const collection = db.collection("restaurants"); // Ensure collection name matches DB

// Get restaurants with pagination
app.use("/api/restaurants", restaurantroutes);
// Get restaurants by location
app.get("/locationR", getRestaurantsByLocation);

// Get restaurant by ID
app.use("/restaurants", getRestaurantById);

// Image search routes
app.use("/searchimage", imageSearchRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
