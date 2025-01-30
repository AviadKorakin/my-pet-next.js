"use client";

import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import {useSession} from "next-auth/react";

export default async function DashboardPage() {
    const { data: session, status } = useSession();

    if (!session) {
        redirect("/login"); // ✅ Redirect users if not logged in
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center">
                    Welcome to your Dashboard, {session.user?.id}!
                </h2>

                <LogoutButton /> {/* ✅ Added the Logout Button here */}
            </div>
        </div>
    );
}
