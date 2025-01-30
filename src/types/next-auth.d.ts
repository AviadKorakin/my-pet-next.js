// Ensure you're importing the right types
import NextAuth, { DefaultSession } from "next-auth";

// Extend the `Session` interface to include `accessToken` and `refreshToken` at the top level
declare module "next-auth" {
    interface Session {
        user: {
            id: string; // Ensure `user.id` exists in the session
        } & DefaultSession["user"];
    }

    interface User {
        id: string; // Ensure `user.id` exists in the User object
    }
}
