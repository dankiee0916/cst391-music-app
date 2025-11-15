"use client";

import AlbumCard from "./AlbumCard";
import { Album } from "@/lib/types";

interface AlbumListProps {
  albumList: Album[];
  onClick: (album: Album, uri: string) => void;
}

export default function AlbumList({ albumList, onClick }: AlbumListProps) {
  const cards = albumList.map((album) => (
    <AlbumCard key={album.id} album={album} onClick={onClick} />
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
