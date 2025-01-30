import mongoose, { Schema, Document } from "mongoose";
import { AdapterUser } from "next-auth/adapters";

// ✅ Define `IUser` without `_id`, using `id` instead
export interface IUser extends Document, AdapterUser {
    id: string; // ✅ Use NextAuth's `id` as the primary identifier
    role: "admin" | "moderator" | "user";
    name:string | null;
    email: string;
    image: string | null;
    emailVerified:Date | null;
    verified: boolean;
    verification_code?: string;
    verification_expires?: Date;
}

const UserSchema = new Schema<IUser>({
    id: { type: String, unique: true, required: true , index: true}, // ✅ This replaces `_id`
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: false },
    emailVerified: { type: Date, required: false },

    // ✅ Custom fields
    role: { type: String, enum: ["admin", "moderator", "user"], default: "user" },
    verified: { type: Boolean, default: false },
    verification_code: { type: String, unique: true, sparse: true },
    verification_expires: { type: Date },
});

// ✅ Ensure Mongoose treats `id` as the primary key
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
