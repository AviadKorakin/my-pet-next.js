import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {authOptions} from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ session: session });
}