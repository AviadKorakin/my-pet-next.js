import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI!;

// Explicitly extend the global object to define `_mongoose`
declare global {
    // Use `globalThis` to ensure TypeScript recognizes global variables correctly
    var _mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

// Ensure `_mongoose` is always initialized
global._mongoose = global._mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
    if (global._mongoose?.conn) {
        return global._mongoose.conn; // ✅ Reuse existing connection
    }

    if (!global._mongoose?.promise) {
        global._mongoose.promise = mongoose.connect(mongoURI).then((mongooseInstance) => {
            console.log("Connected to MongoDB (Mongoose)");
            return mongooseInstance.connection;
        });
    }

    global._mongoose.conn = await global._mongoose.promise;
    return global._mongoose.conn;
}
