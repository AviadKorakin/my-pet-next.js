"use client";

import { signIn, useSession, signOut } from "next-auth/react";

export default function LoginButton() {
    const { data: session } = useSession();

    return session ? (
        <div className="flex flex-col items-center">
            <p className="mb-4">Welcome! Your ID: {session.user?.id}</p>
            <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition"
            >
                Logout
            </button>
        </div>
    ) : (
        <div className="flex flex-col space-y-4">
            <button
                onClick={() => signIn("github")}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
                Sign In with GitHub
            </button>
            <button
                onClick={() => signIn("google")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition"
            >
                Sign In with Google
            </button>
        </div>
    );
}
