"use client";

import "@/app/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <SessionProvider>
            <AuthRedirect>{children}</AuthRedirect> {/* ✅ Handle redirection inside a component */}
        </SessionProvider>
        </body>
        </html>
    );
}

function AuthRedirect({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard"); // ✅ Redirect to dashboard if logged in
        } else if (status === "unauthenticated") {
            router.push("/login"); // ✅ Redirect to login if not logged in
        }
    }, [session, status, router]);

    if (status === "loading") return <p>Loading...</p>; // ✅ Prevent flashing content

    return <>{children}</>; // ✅ Only render children if session is checked
}
