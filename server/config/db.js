// config/db.js
const { MongoClient } = require("mongodb");
require("dotenv").config(); // Ensure .env file is loaded

let client;

async function connectDB() {
  if (client) {
    return client.db("res"); // Return the database instance if already connected
  }
  try {
    // Connect to MongoDB using the URI from the .env file
    client = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect(); // Wait for the connection
    console.log("MongoDB connected successfully");

    return client.db("res"); // Return the connected database
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to the database");
  }
}

module.exports = connectDB; // Export for use in other files
