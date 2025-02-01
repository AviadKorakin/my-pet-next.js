"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center">
                    Welcome to your Dashboard, {session?.user?.id || "Unknown User"}!
                </h2>

                {/* Debug output: print the entire session object */}
                <pre className="bg-gray-200 p-4 rounded my-4 text-sm overflow-x-auto">
          {JSON.stringify(session, null, 2)}
        </pre>

                <button
                    onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                    className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    Link GitHub Provider
                </button>

                {!session?.user?.verified && (
                    <div className="mt-4">
                        <Link href="/verify">
                            <span className="text-blue-600 underline">Verify Your Account</span>
                        </Link>
                    </div>
                )}

                <LogoutButton />
            </div>
        </div>
    );
}
