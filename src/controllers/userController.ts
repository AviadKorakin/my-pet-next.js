// controllers/userController.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyUser } from "@/services/userService";
import { AppError } from "@/errors/AppError";

/**
 * Controller to verify a user.
 *
 * Expects a POST request with a JSON body containing:
 *   - userId: the unique user identifier (string)
 *   - code: the verification code provided by the user (string)
 *
 * If the verification is successful, responds with status 200 and a success message.
 * Otherwise, it throws an error with the appropriate message and status code.
 */
export const verifyUserController = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Allow only POST requests for verification
        if (req.method !== "POST") {
            res.setHeader("Allow", ["POST"]);
            throw new AppError(`Method ${req.method} Not Allowed`, 405);
        }

        const { userId, code } = req.body;

        // Validate the required parameters
        if (!userId || !code) {
            throw new AppError("Missing required parameters: userId and code", 400);
        }

        // Call the service layer to verify the user.
        await verifyUser(userId, code);

        // If successful, return a JSON response.
        res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
};
