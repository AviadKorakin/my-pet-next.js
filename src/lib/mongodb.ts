import { MongoClient } from "mongodb";

const mongoURI = process.env.MONGO_URI!;

let client: MongoClient;
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
    client = new MongoClient(mongoURI);
    global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
