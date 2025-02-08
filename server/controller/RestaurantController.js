const connectDB = require("../config/db");

const getRestaurants = async (req, res) => {
    try {
        // 1️⃣ Connect to Database
        const db = await connectDB();
        const collection = db.collection("new");

        // 2️⃣ Pagination Setup
        const page = parseInt(req.query.page) || 1;
        const pageSize = 8;
        const skip = (page - 1) * pageSize;

        // 3️⃣ Fetch Restaurants with Pagination
        const result = await collection
            .aggregate([
                { $unwind: "$restaurants" },  // Flatten nested arrays
                { $replaceRoot: { newRoot: "$restaurants" } },
                { $skip: skip },
                { $limit: pageSize }
            ])
            .toArray();

        // 4️⃣ Count Total Restaurants
        const countResult = await collection
            .aggregate([{ $unwind: "$restaurants" }, { $count: "total" }])
            .toArray();
        const totalRestaurants = countResult.length > 0 ? countResult[0].total : 0;
        const totalPages = Math.ceil(totalRestaurants / pageSize);

        // 5️⃣ Validate & Send Response
        if (!Array.isArray(result)) {
            return res.status(500).json({ message: "Invalid data format" });
        }

        res.json({ page, pageSize, totalPages, totalRestaurants, restaurants: result });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getRestaurants };
