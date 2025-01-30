import NextAuth, { DefaultSession } from "next-auth";

// Extend the `session.user` object to include `accessToken` and `refreshToken`
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            accessToken?: string;  // Add accessToken to the session
            refreshToken?: string; // Add refreshToken to the session
        } & DefaultSession["user"];
    }

    interface User {
        id: string; // Ensure `user.id` exists in NextAuth
    }
}
