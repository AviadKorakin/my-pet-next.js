import { MongoClient } from "mongodb";

const mongoURI = process.env.MONGO_URI!;

const client = new MongoClient(mongoURI);

// Initiate the connection. Note: This is asynchronous.
client.connect().catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
});

export default client;
