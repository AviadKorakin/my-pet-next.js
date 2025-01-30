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
    session: { strategy: "jwt" },
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: true
            },
        },
    },
    pages: {
        signIn: "/login", // ✅ Redirect users to a custom login page
    },
    callbacks: {
        async jwt({ token, user }) {
            // If user is available (on sign-in), store their ID in the JWT
            console.log("🔹 JWT Callback - Token:", token); // ✅ Debugging
            if (user) {
                token.id = user.id; // Store MongoDB _id (from NextAuth)
            }
            return token;
        },

        async session({ session, token }) {
            // Retrieve user ID from token and assign it to session.user
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

