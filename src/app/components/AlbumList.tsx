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

  const cards = albumList.map((album) => {
    // owner is the user who originally created the album
    const isOwner = album.createdBy === userEmail;

    // can edit if admin or owner
    const canEdit = isAdmin || isOwner;

    return (
      <AlbumCard
        key={album.id}
        album={album}
        onClick={onClick}
        canView={isLoggedIn}  // guests: false, users/admin: true
        canEdit={canEdit}     // admins or owners can edit
      />
    );
  });

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
