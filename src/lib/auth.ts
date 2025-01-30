import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import CustomMongoDBAdapter from "@/lib/MyPetDBAdapter";

export const authOptions: AuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    adapter: CustomMongoDBAdapter(clientPromise), // ✅ Use MongoDB for session storage
    pages: {
        signIn: "/login", // ✅ Redirect users to a custom login page
    },
    session: {
        strategy: "database", // ✅ Ensure database session is explicitly set
        maxAge: 14 * 24 * 60 * 60, // 14 days session expiration
        updateAge: 24 * 60 * 60, // Refresh session every 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
};
