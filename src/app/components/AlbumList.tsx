"use client";

import AlbumCard from "./AlbumCard";
import { Album } from "@/lib/types";
import { useSession } from "next-auth/react";

interface AlbumListProps {
  albumList: Album[];
  onClick: (album: Album, uri: string) => void;
}

export default function AlbumList({ albumList, onClick }: AlbumListProps) {
  const { data: session } = useSession();

  // Read allowed admin emails from env (comma-separated)
  const adminEmails =
    process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") ?? [];

  const userEmail = session?.user?.email ?? "";
  const isLoggedIn = !!session?.user;
  const isAdmin = adminEmails.includes(userEmail); // always boolean

  const cards = albumList.map((album) => (
    <AlbumCard
      key={album.id}
      album={album}
      onClick={onClick}
      canView={isLoggedIn}  // guests: false, users/admin: true
      canEdit={isAdmin}     // only admins can edit
    />
  ));

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "flex-start",
      }}
    >
      {cards}
    </div>
  );
}
