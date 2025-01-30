import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {authOptions} from "@/lib/auth";

export async function GET(req: Request) {
    console.log("🔹 [LOG] Session API Called"); // ✅ Log when the API is hit

    // Log incoming cookies
    const cookies = req.headers.get("cookie");
    console.log("🔹 Incoming Cookies:", cookies); // ✅ Log all cookies


    const session = await getServerSession(authOptions);

    console.log("🔹 [LOG] Session Data:", session); // ✅ Log the session data

    if (!session) {
        console.log("❌ [ERROR] No Session Found - Returning 401");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ user: session.user });
}