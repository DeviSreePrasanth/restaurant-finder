const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = "mongodb+srv://dsp771122:322103310040@cluster0.wjiwhhl.mongodb.net/"; // Replace with your MongoDB Atlas connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function uploadData() {
    try {
        // Connect to the MongoDB client
        await client.connect();

        // Get the database and collection
        const database = client.db('zomato');
        const collection = database.collection('res');

        const data = JSON.parse(fs.readFileSync('./file5.json', 'utf8'));

        // Insert the data into the collection
        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents were inserted.`);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

uploadData();