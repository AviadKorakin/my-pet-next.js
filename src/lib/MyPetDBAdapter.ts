import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import User, { ICustomUser } from "@/models/User";
import { Adapter, AdapterUser } from "next-auth/adapters";
import mongoose from "mongoose";

const CustomMongoDBAdapter = (): Adapter => {
    const adapter = MongoDBAdapter(clientPromise);

    return {
        ...adapter,

        // ✅ Override createUser to include our custom fields
        async createUser(profile: any): Promise<AdapterUser> {
            console.log("🔹 Custom Create User Called:", profile);

            const newUser = await User.create({
                name: profile.name,
                email: profile.email,
                image: profile.image,
                emailVerified: profile.emailVerified,

                // ✅ Add custom fields
                role: "user",
                verified: false,
                verification_code: null,
                verification_expires: null,
            });

            return newUser.toObject() as AdapterUser;
        },

        // ✅ Ensure getUser also returns custom fields
        async getUser(id: string): Promise<AdapterUser | null> {
            console.log("🔹 Getting User by ID:", id);
            return  User.findById(id);
        },

        // ✅ Ensure getUserByEmail returns custom fields
        async getUserByEmail(email: string): Promise<AdapterUser | null> {
            console.log("🔹 Getting User by Email:", email);
            return User.findOne({ email });
        },

        // ✅ Ensure updateUser can modify custom fields
        async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
            console.log("🔹 Updating User:", user);
            const updatedUser = await User.findByIdAndUpdate(user.id, user, { new: true });

            if (!updatedUser) {
                throw new Error(`User with ID ${user.id} not found.`);
            }

            return updatedUser.toObject() as AdapterUser;
        },
    };
};

export default CustomMongoDBAdapter;
