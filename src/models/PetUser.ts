import mongoose, { Schema, Document } from "mongoose";

export interface IPetUser extends Document {
    userId: string; // ✅ Reference to NextAuth `User` table
    petName: string;
    petType: "dog" | "cat" | "rabbit" | "other";
    createdAt: Date;
}

const PetUserSchema = new Schema<IPetUser>({
    userId: { type: String, ref: "User", required: true, unique: true }, // ✅ Foreign Key to User
    petName: { type: String, required: true },
    petType: { type: String, enum: ["dog", "cat", "rabbit", "other"], required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PetUser || mongoose.model<IPetUser>("PetUser", PetUserSchema);
