"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav
      style={{
        backgroundColor: "#333",
        color: "white",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        Francisco's Music App
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link href="/" style={{ color: "white" }}>
          Home
        </Link>

        <Link href="/new" style={{ color: "white" }}>
          Add Album
        </Link>

        <Link href="/search" style={{ color: "white" }}>
          Search
        </Link>
      </div>
    </nav>
  );
}
