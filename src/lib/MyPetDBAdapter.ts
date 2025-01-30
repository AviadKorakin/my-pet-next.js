import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import { Adapter, AdapterUser, AdapterSession, AdapterAccount, VerificationToken } from "next-auth/adapters";
import mongoose from "mongoose";
import {connectToDatabase} from "@/lib/mongoose";
import {MongoClient} from "mongodb";

const CustomMongoDBAdapter = (clientPromise: Promise<MongoClient>): Adapter => {
    const adapter = MongoDBAdapter(clientPromise);

    return {
        ...adapter, // ✅ Keep all other default adapter methods

        // ✅ Create a new user, ensuring we store `id` from NextAuth
        async createUser(userData: AdapterUser): Promise<AdapterUser> {
            await connectToDatabase();
            console.log("🔹 Creating New User:", userData);

            const newUser = await User.create({
                id: userData.id, // ✅ Generate unique ID
                name: userData.name,
                email: userData.email,
                image: userData.image,
                emailVerified: userData.emailVerified,

                // ✅ Custom fields
                role: "user",
                verified: false,
                verification_code: null,
                verification_expires: null,
            });

            return newUser.toObject() as AdapterUser;
        }
    };
};

export default CustomMongoDBAdapter;
