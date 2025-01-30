import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { handleGitHubLogin } from "@/controllers/authController";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authOptions: AuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    pages: {
        signIn: "/login", // ✅ Redirect users to a custom login page
    },
    callbacks: {
        async jwt({ token, user,  account }) {
            // If user is available (on sign-in), store their ID in the JWT
            if (account) {
                token.accessToken = account.access_token;  // Store access token
                token.refreshToken = account.refresh_token; // Store refresh token
            }
            if (user) {
                token.id = user.id; // Store MongoDB _id (from NextAuth)
            }
            console.log("Data"+ JSON.stringify({ token }));
            return token;
        },

        async session({ session, token }) {
            // Retrieve user ID from token and assign it to session.user
            session.accessToken = token.accessToken ? token.accessToken as string : undefined;
            session.refreshToken = token.refreshToken ? token.refreshToken  as string : undefined;
            console.log("🔹 Session Callback - Token:", token); // ✅ Debugging
            if (token.id) {
                session.user.id = String(token.id);
            }
            console.log("🔹 Session Callback - Session:", session); // ✅ Debugging
            return session;
        },

        async signIn({ account }) {
            const user = await handleGitHubLogin(account);
            return !!user;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

