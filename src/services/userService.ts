// services/userService.ts
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { AppError } from "@/errors/AppError";

/**
 * Verifies a user by checking if the provided verification code matches the one stored.
 * If the code is correct and not expired, this function updates the user by:
 *  - setting verified to true,
 *  - clearing verification_code,
 *  - clearing verification_expires.
 *
 * @param userId - The unique string identifier of the user.
 * @param code - The verification code provided by the user.
 * @throws AppError if the user is not found, the code is incorrect, or the code has expired.
 */
export const verifyUser = async (userId: string, code: string): Promise<void> => {
    // Ensure the database connection is established
    await connectToDatabase();

    // Find the user by the custom "id" field
    const user = await User.findOne({ id: userId });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Check if the provided code matches
    if (user.verification_code !== code) {
        throw new AppError("Incorrect verification code", 400);
    }

    // Check if the verification code has expired
    if (user.verification_expires && new Date() > user.verification_expires) {
        throw new AppError("Verification code expired", 400);
    }

    // Update the user: mark as verified and clear the verification fields
    user.verified = true;
    user.verification_code = null;
    user.verification_expires = null;
    await user.save();
};
