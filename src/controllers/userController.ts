// app/api/user/verify-user/route.ts
import { NextResponse } from "next/server";
import { verifyUser } from "@/services/userService";
import { AppError } from "@/errors/AppError";

export async function POST(request: Request) {
    try {
        // Parse the JSON request body
        const { userId, code } = await request.json();

        // Validate required fields
        if (!userId || !code) {
            throw new AppError("Missing required parameters: userId and code", 400);
        }

        // Call the service to verify the user
        await verifyUser(userId, code);

        // Return a success response if verification passes
        return NextResponse.json(
            { message: "User verified successfully" },
            { status: 200 }
        );
    } catch (error) {
        // Handle AppError instances with specific status codes
        if (error instanceof AppError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.statusCode }
            );
        }

        // Handle any unexpected errors
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
