import NextAuth, { DefaultSession } from "next-auth";

// Extend the `session.user` object
declare module "next-auth" {
    interface Session {
        user: {
            id: string; // ✅ Add the missing `id` field
        } & DefaultSession["user"];
    }

    interface User {
        id: string; // ✅ Ensure `user.id` exists in NextAuth
    }
}