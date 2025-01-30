import mongoose, { Schema, Document } from "mongoose";
import { AdapterUser } from "next-auth/adapters";

export interface ICustomUser extends AdapterUser {
    role: "admin" | "moderator" | "user";
    verified: boolean;
    verification_code?: string;
    verification_expires?: Date;
}

const UserSchema = new Schema<ICustomUser>({
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

export default mongoose.models.User || mongoose.model<ICustomUser>("User", UserSchema);
