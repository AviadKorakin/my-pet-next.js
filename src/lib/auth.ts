import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider, {GithubProfile} from "next-auth/providers/github";
import clientPromise from "@/lib/mongodb";
import {MongoDBAdapter} from "@auth/mongodb-adapter";
import {CustomMongoAdapter} from "@/lib/CustomMongoAdapter";

export const authOptions: AuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            profile(profile: GithubProfile) {
                return {
                    // Return the default fields
                    id: profile.id.toString(),
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: "user", // Default role
                    verified: false, // New users are unverified
                    verification_code: null, // No verification code initially
                    verification_expires: null, // No expiration date initially

                }
            }
        }),
    ],
    adapter: CustomMongoAdapter(clientPromise), // ✅ Use MongoDB for session storage
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
