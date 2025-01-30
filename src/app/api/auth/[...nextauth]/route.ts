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
    pages: {
        signIn: "/login", // ✅ Redirect users to a custom login page
    },
    callbacks: {
        async jwt({ token, user }) {
            // If user is available (on sign-in), store their ID in the JWT
            if (user) {
                token.id = user.id; // Store MongoDB _id (from NextAuth)
            }
            return token;
        },

        async session({ session, token }) {
            // Retrieve user ID from token and assign it to session.user
            if (token.id) {
                session.user.id = String(token.id);
            }
            return session;
        },

        async signIn({ account }) {
            const user = await handleGitHubLogin(account);
            return !!user;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

// Ensure Next.js API compatibility
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
