import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

// Handle GET request to fetch all users
export async function GET() {
    try {
        await connectToDatabase();

        // Fetch all users
        const users = await User.find();
        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// Handle POST request to create a new user
export async function POST(request: Request) {
    try {
        const data = await request.json();

        await connectToDatabase();

        // Create a new user
        const newUser = new User(data);
        await newUser.save();

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}
