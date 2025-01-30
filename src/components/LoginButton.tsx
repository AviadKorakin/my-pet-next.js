"use client";

import { signIn, useSession, signOut } from "next-auth/react";

export default function LoginButton() {
    const { data: session } = useSession();

    return session ? (
        <div>
            <p>Welcome! Your ID: {session.user?.id}</p>
            <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition"
            >
                Logout
            </button>
        </div>
    ) : (
        <button
            onClick={() => signIn("github")}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
            Sign In with GitHub
        </button>
    );
}
