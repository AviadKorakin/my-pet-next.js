import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider, {GithubProfile} from "next-auth/providers/github";
import GoogleProvider, {GoogleProfile} from "next-auth/providers/google";
import {CustomMongoAdapter} from "@/lib/CustomMongoAdapter";
import client from "@/lib/mongodb";

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

                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string, // ✅ Use Google Client ID
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            profile(profile: GoogleProfile) {
                return {
                    // Return the default fields
                    id: profile.sub.toString(),
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,

                }
            }
        }),
    ],
    adapter: CustomMongoAdapter(client), // ✅ Use MongoDB for session storage
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
