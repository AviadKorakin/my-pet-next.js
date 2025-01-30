import { DefaultSession, DefaultUser } from "next-auth";
import { AdapterUser as DefaultAdapterUser } from "@auth/core/adapters"; // ✅ Import base AdapterUser

declare module "next-auth" {
    interface User extends DefaultUser {
        role: "admin" | "moderator" | "user"; // ✅ Add role
        verified: boolean; // ✅ Add verification status
        verification_code?: string | null;
        verification_expires?: Date | null;
    }

    interface Session extends DefaultSession {
        user: User; // ✅ Ensures session.user includes custom fields
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser extends DefaultAdapterUser {
        role: "admin" | "moderator" | "user"; // ✅ Extend AdapterUser
        verified: boolean;
        verification_code?: string | null;
        verification_expires?: Date | null;
    }
}