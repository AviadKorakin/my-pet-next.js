import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    id: string; // Our custom unique identifier as a string
    name: string;
    email: string;
    image?: string | null;
    role: "admin" | "moderator" | "user";
    verified: boolean;
    verification_code?: string | null;
    verification_expires?: Date | null;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            // Default value using a new ObjectId string
            default: () => new mongoose.Types.ObjectId().toString(),
        },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        image: { type: String, default: null },
        role: { type: String, enum: ["admin", "moderator", "user"], default: "user" },
        verified: { type: Boolean, default: false },
        verification_code: { type: String, default: null },
        verification_expires: { type: Date, default: null },
    },
    {
        _id: false,
        timestamps: true,
    }
);

export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
