"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function VerifyPage() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Ensure user id is available from session
        if (!session?.user?.id) {
            alert("User not found. Please log in again.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/user/verifyuser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: session.user.id, code }),
            });
            const data = await res.json();

            if (!res.ok) {
                // The API should return an error message and a status code using AppError.
                throw new Error(data.error || "Verification failed");
            }

            alert(data.message || "User verified successfully");
            router.push("/dashboard");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    Verify Your Account
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter verification code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="border p-2 rounded w-full mb-4"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition"
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </form>
            </div>
        </div>
    );
}
