const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { getRestaurantsByLocation } = require("./controller/LocationController");
const getRestaurantById = require("./routes/SearchRoutes");
const imageSearchRoutes = require("./routes/imageSearchRoutes");
const restaurantRoutes = require("./routes/RestaurantRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB using the URI provided in the .env file
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("connected", () => console.log("MongoDB connected successfully"));
db.on("error", (err) => console.error("MongoDB connection error:", err));

const collection = db.collection("new");

// ✅ Use location-based restaurant search
app.get("/locationR", getRestaurantsByLocation);

// ✅ Use search by restaurant ID
app.use("/restaurants", getRestaurantById);

// ✅ Use image search route for detecting food and finding restaurants
app.use("/searchimage", imageSearchRoutes);

app.use("/restaurants",restaurantRoutes);
// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
