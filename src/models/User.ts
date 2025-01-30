import mongoose, { Schema, Document } from "mongoose";

interface IAvatar {
    image_id: number;
    s3_file_path: string;
    folder_file_path: string;
    url: string;
    created_at: Date;
}

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId; // Default MongoDB ID
    google_id?: string; // Google OAuth ID
    github_id?: string; // GitHub OAuth ID
    apple_id?: string; // Apple OAuth ID
    first_name: string;
    last_name: string;
    role: "admin" | "moderator" | "user"; // Role hierarchy
    phone_number: string;
    avatars: IAvatar[];
    verified: boolean; // If the user has verified their email
    verification_code?: string; // Code sent via email
    verification_expires?: Date; // Expiration timestamp for the code
    created_at: Date;
}

const AvatarSchema = new Schema<IAvatar>({
    image_id: { type: Number, required: true, unique: true, index: true },
    s3_file_path: { type: String, required: true },
    folder_file_path: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>({
    google_id: { type: String, unique: true, sparse: true },
    github_id: { type: String, unique: true, sparse: true },
    apple_id: { type: String, unique: true, sparse: true },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    role: { type: String, enum: ["admin", "moderator", "user"], default: "user" },
    phone_number: { type: String, required: false },
    avatars: { type: [AvatarSchema], default: [] },
    verified: { type: Boolean, default: false }, // User starts as unverified
    verification_code: { type: String, unique: true, sparse: true },
    verification_expires: { type: Date },
    created_at: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
