"use client";

import "@/app/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <SessionProvider refetchInterval={5 * 60}>
            <AuthRedirect>{children}</AuthRedirect>
        </SessionProvider>
        </body>
        </html>
    );
}

function AuthRedirect({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname(); // ✅ Get the current path

    useEffect(() => {
        if (status === "loading") return; // ✅ Prevent redirecting before session is checked

        if (status === "authenticated" && pathname === "/login") {
            router.push("/dashboard"); // ✅ Only redirect if already on the login page
        } else if (status === "unauthenticated" && pathname !== "/login") {
            router.push("/login"); // ✅ Only redirect to login if not already there
        }
    }, [status, pathname, router]);

    if (status === "loading") return <p>Loading...</p>; // ✅ Prevent flashing content

    return <>{children}</>; // ✅ Only render children after session check
}
