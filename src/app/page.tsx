"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { get } from "@/lib/apiClient";
import { Album } from "@/lib/types";
import NavBar from "./components/NavBar";
import AlbumCard from "./components/AlbumCard";
import AlbumList from "./components/AlbumList";

export default function Page() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [currentlySelectedAlbumId, setCurrentlySelectedAlbumId] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const handleAlbumClick = (album: Album, uri: string) => {
    updateSingleAlbum(album.id, uri);
  };

  let router = useRouter();

  const loadAlbums = async () => {
    try {
      const data = await get<Album[]>("/albums");
      console.log("Fetched albums:", data);
      setAlbumList(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load albums:", err);
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const updateSearchResults = async (phrase: string) => {
    console.log("phrase is " + phrase);
    setSearchPhrase(phrase);
  };

  const updateSingleAlbum = (albumId: number, uri: string) => {
    console.log("Update Single Album = ", albumId);
    setCurrentlySelectedAlbumId(albumId);
    const path = `${uri}${albumId}`;
    console.log("path", path);
    router.push(path);
  };

  const renderedList = albumList.filter((album) => {
    if (
      (album.description ?? "").toLowerCase().includes(searchPhrase.toLowerCase()) ||
      searchPhrase === ""
    ) {
      return true;
    }
    return false;
  });

  const onEditAlbum = () => {
    loadAlbums();
    router.push("/");
  };

  return (
    <main>
      <NavBar />
      <h1>Francisco's Album List</h1>
      <p>This is a list of albums I listen to on a daily!</p>
      {!error && albumList.length > 0 && (
        <>
          {/* Full AlbumList */}
          <AlbumList albumList={albumList} onClick={handleAlbumClick} />
        </>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!error && albumList.length === 0 && <p>Loading albums...</p>}
    </main>
  );
}
