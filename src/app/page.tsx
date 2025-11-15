"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [albumList, setAlbumList] = useState<any[]>([]);
  const [currentlySelectedAlbumId, setCurrentlySelectedAlbumId] = useState(0);

  let router = useRouter();

  const loadAlbums = async () => {
    const response = await fetch("/api/albums");
    const data = await response.json();
    console.log("Fetched albums:", data);
    setAlbumList(data);
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
    const indexNumber = albumList.findIndex((a) => a.id === albumId);
    setCurrentlySelectedAlbumId(indexNumber);
    const path = `${uri}${indexNumber}`;
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
      <h1>Francisco's Album List (Debug View)</h1>
      <p>This JSON data is rendered directly from the API response.</p>

      <pre
        style={{
          backgroundColor: "#f4f4f4",
          padding: "1rem",
          borderRadius: "8px",
          overflow: "auto",
          color: "#111",
          fontSize: "0.9rem",
          lineHeight: "1.4",
        }}
      >
        {albumList.length > 0 && JSON.stringify(albumList, null, 2)}
      </pre>

      {albumList.length === 0 && <p>Loading albums...</p>}
    </main>
  );
}
