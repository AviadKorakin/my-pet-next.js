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
    adapter: MongoDBAdapter(clientPromise), // ✅ Use MongoDB for session storage
    pages: {
        signIn: "/login", // ✅ Redirect users to a custom login page
    },
    session: {
        strategy: "database", // ✅ Ensure database session is explicitly set
        maxAge: 14 * 24 * 60 * 60, // 30 days session expiration
        updateAge: 24 * 60 * 60, // Refresh session every 24 hours
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // ✅ Store MongoDB user ID inside token
            }
            return token;
        },

        async session({ session, token }) {
            console.log("🔹 Session Callback - Token:", token); // ✅ Debugging
            if (token.id) {
                session.user.id = String(token.id); // ✅ Ensure ID is stored
            }
            console.log("🔹 Session Callback - Session:", session); // ✅ Debugging
            return session;
        },

        async signIn({ account}) {
            const user = await handleGitHubLogin(account);
            return !!user;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
