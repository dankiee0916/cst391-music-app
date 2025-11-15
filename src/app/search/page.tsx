"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { get } from "@/lib/apiClient";
import { Album } from "@/lib/types";
import SearchForm from "../components/SearchForm";
import AlbumList from "../components/AlbumList";

export default function SearchPage() {
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const router = useRouter();

  const updateSingleAlbum = (album: Album, uri: string) => {
    console.log("Selected ID is " + album.id);
    router.push(`${uri}${album.id}`);
  };

  const updateSearchResults = async (term: string) => {
    console.log("search term: ", term);

    if (!term) {
      setAlbumList([]);
      return;
    }

    try {
      // use the Next.js search endpoint by description
      const results = await get<Album[]>(
        `/albums/search/description/${encodeURIComponent(term)}`
      );
      setAlbumList(results);
    } catch (error) {
      console.error("Search failed:", error);
      setAlbumList([]);
    }
  };

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Search Albums</h1>
      <SearchForm onSubmit={updateSearchResults} />
      <AlbumList albumList={albumList} onClick={updateSingleAlbum} />
    </main>
  );
}
