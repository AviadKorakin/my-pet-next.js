import mongoose, { Schema, Document } from "mongoose";

interface IAvatar {
    image_id: number;
    s3_file_path: string;
    folder_file_path: string;
    url: string;
    created_at: Date;
}

export interface IServerUser extends Document {
    _id: mongoose.Types.ObjectId;
    google_id?: string;
    github_id?: string;
    apple_id?: string;
    first_name: string;
    last_name: string;
    role: "admin" | "moderator" | "user";
    phone_number: string;
    avatars: IAvatar[];
    verified: boolean;
    verification_code?: string;
    verification_expires?: Date;
    created_at: Date;
}

const AvatarSchema = new Schema<IAvatar>({
    image_id: { type: Number, required: true, unique: true, index: true },
    s3_file_path: { type: String, required: true },
    folder_file_path: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

const ServerUserSchema = new Schema<IServerUser>({
    google_id: { type: String, unique: true, sparse: true, required: false },
    github_id: { type: String, unique: true, sparse: true, required: false },
    apple_id: { type: String, unique: true, sparse: true, required: false },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    role: { type: String, enum: ["admin", "moderator", "user"], default: "user" },
    phone_number: { type: String, required: false },
    avatars: { type: [AvatarSchema], default: [] },
    verified: { type: Boolean, default: false },
    verification_code: { type: String, unique: true, sparse: true },
    verification_expires: { type: Date },
    created_at: { type: Date, default: Date.now },
});

// ✅ Rename Model to `ServerUser`
export default mongoose.models.ServerUser || mongoose.model<IServerUser>("ServerUser", ServerUserSchema);
