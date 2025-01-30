import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import PetUser from "@/models/PetUser"; // ✅ Import PetUser model
import { connectToDatabase } from "@/lib/mongoose"; // ✅ Ensure DB connection

export const authOptions: AuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise), // ✅ Use MongoDB for session storage
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "database",
        maxAge: 14 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    callbacks: {
        async signIn({ user }) {
            await connectToDatabase();
            console.log("🔹 User Signed In:", user);

            // ✅ Check if `PetUser` already exists
            const existingPetUser = await PetUser.findOne({ userId: user.id });

            if (!existingPetUser) {
                console.log("🔹 Creating New PetUser for:", user.id);

                await PetUser.create({
                    userId: user.id, // ✅ Link PetUser to User
                    petName: "Buddy", // Default pet name (user can update it later)
                    petType: "dog", // Default pet type (user can change later)
                });
            }

            return true; // ✅ Allow sign-in
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
