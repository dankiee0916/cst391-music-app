"use client";
// app/edit/[albumId]/page.tsx

// use built-in fetch instead of a missing apiClient module

import { get, post, put } from "@/lib/apiClient";
import { Album, Track } from "@/lib/types";
import { useParams, useRouter, usePathname } from "next/navigation"; // added usePathname
import { useState, useEffect } from "react";

export default function EditAlbumPage() {
    const router = useRouter();

    const pathname = usePathname();
    const isReadOnly = pathname.startsWith("/show/");

    const params = useParams();
    const albumId = params?.albumId as string | undefined;
 

    const defaultAlbum: Album = {
        id: 0,
        title: "",
        artist: "",
        description: "",
        year: 0,
        image: "",
        tracks: [] as Track[],
    };

    // Type safe use of defaultAlbum to initialize state
    // Rather than the ad hoc album object used previously, this ensures correct typing and calms TypeScript
    const [album, setAlbum] = useState(defaultAlbum);

    // Load album only when editing or viewing
   useEffect(() => {
  if (!albumId) return; // creation mode (/new)
  (async () => {
    const res = await get<Album>(`/albums/by-id/${albumId}`);
    setAlbum(res);
  })();
}, [albumId]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isReadOnly) {
    return;
  }

   const payload = { ...album, albumId: album.id };

  if (albumId) {
    // UPDATE existing album
    await put<Album, Album>("/albums", payload);
  } else {
    // CREATE new album
    await post<Album, Album>("/albums", payload);
  }

  router.push("/");
};

    const onChange =
        (key: string) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setAlbum((prev) => ({ ...prev, [key]: e.target.value }));

    // Heading changes depending on read-only / edit / create mode
    const headingText = isReadOnly
        ? "View Album"
        : albumId
            ? "Edit Album"
            : "Create Album";

    return (
        <main style={{ padding: "1rem" }}>
            <h1>{headingText}</h1>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Title"
                    value={album.title}
                    onChange={onChange("title")}
                    disabled={isReadOnly}
                />
                <input
                    placeholder="Artist"
                    value={album.artist}
                    onChange={onChange("artist")}
                    disabled={isReadOnly}
                />
                <input
                    placeholder="Year"
                    value={album.year ?? ""}
                    onChange={onChange("year")}
                    disabled={isReadOnly}
                />
                <textarea
                    placeholder="Description"
                    value={album.description}
                    onChange={onChange("description")}
                    disabled={isReadOnly}
                />
                <input
                    placeholder="Image URL"
                    value={album.image}
                    onChange={onChange("image")}
                    disabled={isReadOnly}
                />

                {/* In view mode show Home button only */}
                {isReadOnly ? (
                    <button
                        type="button"
                        style={{ marginTop: "10px" }}
                        onClick={() => router.push("/")}
                    >
                        Home
                    </button>
                ) : (
                    <button type="submit" style={{ marginTop: "10px" }}>
                        {albumId ? "Update" : "Save"}
                    </button>
                )}
            </form>
        </main>
    );
    console.log("PARAMS:", params);
console.log("albumId:", albumId);
}
