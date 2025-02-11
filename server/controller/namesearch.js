const connectDB = require("../config/db");

const getRestaurantByName = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: "Restaurant name is required" });
        }

        const db = await connectDB();
        const collection = db.collection("new"); // Ensure correct collection name

        // Case-insensitive regex for partial matching
        const regex = new RegExp(name, "i");

        const documents = await collection.aggregate([
            { $unwind: "$restaurants" }, // Flatten the array
            {
                $match: {
                    "restaurants.restaurant.name": regex
                }
            },
            {
                $project: {
                    id: "$restaurants.restaurant.id", 
                    name: "$restaurants.restaurant.name",
                    cuisine: "$restaurants.restaurant.cuisines",
                    location: "$restaurants.restaurant.location",
                    featured_image: "$restaurants.restaurant.featured_image",
                    average_cost_for_two: "$restaurants.restaurant.average_cost_for_two",
                    aggregate_rating: "$restaurants.restaurant.user_rating.aggregate_rating"
                }
            }
        ]).toArray();

        if (documents.length === 0) {
            return res.status(404).json({ message: "No restaurants found" });
        }

        res.status(200).json(documents);
    } catch (error) {
        console.error("❌ Error fetching restaurant:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getRestaurantByName };
