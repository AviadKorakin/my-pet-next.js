import {MongoDBAdapter} from "@auth/mongodb-adapter";
import User, {IUser} from "@/models/User";
import {Adapter} from "next-auth/adapters";
import {MongoClient} from "mongodb";
import {connectToDatabase} from "@/lib/mongoose";

const CustomMongoDBAdapter = (clientPromise: Promise<MongoClient>): Adapter => {
    const adapter = MongoDBAdapter(clientPromise);

    return {
        ...adapter,

        // ✅ Override createUser to include our custom fields
        async createUser(profile: any): Promise<IUser> {
            await connectToDatabase();
            console.log("🔹 Custom Create User Called:", profile);

            return await User.create({
                id: profile.id,
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
        },

        // ✅ Ensure getUser also returns custom fields
        async getUser(id: string): Promise<IUser | null> {
            await connectToDatabase();
            console.log("🔹 Getting User by ID:", id);
            return(await User.findOne({id: id }));
        },

        // ✅ Ensure getUserByEmail returns custom fields
        async getUserByEmail(email: string): Promise<IUser | null> {
            await connectToDatabase();
            console.log("🔹 Getting User by Email:", email);
            return (await User.findOne({email: email }));
        },

        // ✅ Ensure updateUser can modify custom fields
        async updateUser(user: Partial<IUser> & Pick<IUser, "id">): Promise<IUser> {
            await connectToDatabase();
            console.log("🔹 Updating User:", user);
            const updatedUser = await User.findByIdAndUpdate(user.id, user, { new: true });

            if (!updatedUser) {
                throw new Error(`User with ID ${user.id} not found.`);
            }

            return updatedUser;
        },
    };
};

export default CustomMongoDBAdapter;
