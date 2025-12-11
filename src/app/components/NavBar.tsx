"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  // pull email + role off the session 
  const userEmail = session?.user?.email ?? "";
  const userRole = (session?.user as any)?.role as "admin" | "user" | undefined;

  return (
    <nav
      style={{
        backgroundColor: "#333",
        color: "white",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        Francisco&apos;s Music App
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ color: "white" }}>
          Home
        </Link>

        {isLoggedIn && (
          <Link href="/new" style={{ color: "white" }}>
            Add Album
          </Link>
        )}

        {isLoggedIn && (
          <Link href="/favorites" style={{ color: "white" }}>
            Favorites
          </Link>
        )}

        <Link href="/search" style={{ color: "white" }}>
          Search
        </Link>

        <Link href="/about" style={{ color: "white" }}>
          About
        </Link>

        {/* show who is logged in + role when signed in */}
        {isLoggedIn && (
          <span
            style={{
              fontSize: "0.85rem",
              opacity: 0.9,
              marginRight: "8px",
            }}
          >
            {userEmail}
            {userRole && ` (${userRole})`}
          </span>
        )}

        {!isLoggedIn && (
          <button
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: 0,
            }}
            onClick={() => signIn("github")}
          >
            Sign In
          </button>
        )}

        {isLoggedIn && (
          <button
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: 0,
            }}
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
