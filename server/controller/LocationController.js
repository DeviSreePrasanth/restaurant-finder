const mongoose = require("mongoose");
require("dotenv").config(); // Make sure to load environment variables

// Get MongoDB URI from the environment
const mongoUri = process.env.MONGO_URI;

const getRestaurantsByLocation = async (req, res) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = mongoose.connection;
        const collection = db.collection("new");

        const { lat, lng, radius } = req.query;
        if (!lat || !lng || !radius) {
            return res.status(400).json({ message: "Latitude, longitude, and radius are required." });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const searchRadius = parseFloat(radius) / 6378.1;  // Convert radius to radians

        if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
            return res.status(400).json({ message: "Invalid latitude, longitude, or radius." });
        }

        // Perform the aggregation query to search by location
        const restaurants = await collection.aggregate([
            { $unwind: "$restaurants" },
            {
                $addFields: {
                    "restaurants.restaurant.location.coordinates": {
                        $map: {
                            input: ["$restaurants.restaurant.location.longitude", "$restaurants.restaurant.location.latitude"],
                            as: "coord",
                            in: { $toDouble: "$$coord" }
                        }
                    }
                }
            },
            {
                $match: {
                    "restaurants.restaurant.location.coordinates": {
                        $geoWithin: {
                            $centerSphere: [[longitude, latitude], searchRadius]
                        }
                    }
                }
            },
            { $replaceRoot: { newRoot: "$restaurants" } }
        ]).toArray();

        // Send the restaurants in the response
        res.json(restaurants);

    } catch (error) {
        console.error("Error in location search:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getRestaurantsByLocation };
