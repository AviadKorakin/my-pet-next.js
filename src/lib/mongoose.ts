import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI!;

// Explicitly extend the global object to define `_mongoose`
declare global {
    var _mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

// Ensure `_mongoose` is always initialized
global._mongoose = global._mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
    if (global._mongoose?.conn && isConnectionValid(global._mongoose.conn)) {
        return global._mongoose.conn; // ✅ Reuse existing connection
    }

    if (!global._mongoose?.promise) {
        global._mongoose.promise = mongoose.connect(mongoURI).then(async (mongooseInstance) => {
            console.log("✅ Connected to MongoDB (Mongoose)");

            // ✅ Only clear the database on the first connection
            // if (process.env.CLEAR_DB_ON_STARTUP === "true") {
            //     console.log("⚠️ Clearing database...");
            //     await clearDatabase(mongooseInstance.connection);
            //     console.log("✅ Database cleared!");
            // }

            return mongooseInstance.connection;
        });
    }

    global._mongoose.conn = await global._mongoose.promise;
    return global._mongoose.conn;
}

// ✅ Function to Clear Database
async function clearDatabase(conn: mongoose.Connection) {
    if(!conn.db) return;
    const collections = await conn.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({}); // ⚠️ Deletes all data
        console.log(`🗑️ Cleared collection: ${collection.collectionName}`);
    }
}
function isConnectionValid(conn: mongoose.Connection): boolean {
    return conn.readyState === 1 || conn.readyState === 2;
    // 1 = Connected ✅
    // 2 = Connecting ⏳ (Allow it to continue)
}
