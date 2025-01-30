"use client";

import LoginButton from "@/components/LoginButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const router = useRouter();


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center">Sign in</h2>
                <p className="text-gray-600 text-center mb-4">Continue with your GitHub account</p>

                <LoginButton /> {/* ✅ Added the Login Button here */}
            </div>
        </div>
    );
}
