const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = "mongodb+srv://dsp771122:322103310040@cluster0.wjiwhhl.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function uploadData() {
    try {
        await client.connect();

        const database = client.db('res');
        const collection = database.collection('new');

        const data = JSON.parse(fs.readFileSync('./restaurants.json', 'utf8'));

        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents were inserted.`);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

uploadData();