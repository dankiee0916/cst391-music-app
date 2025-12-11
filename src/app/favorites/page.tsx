"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get, del } from "@/lib/apiClient";
import { Album } from "@/lib/types";
import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar";
import AlbumCard from "../components/AlbumCard";

// shape of one favorite row from /api/favorites
type FavoriteRow = {
  id: number;                
  album_id: number;          
  created_at: string;
  title: string;
  artist: string;
  year?: number | null;
  image?: any;
  description: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const { data: session } = useSession();

  const userEmail = session?.user?.email ?? "";
  const isLoggedIn = !!session?.user;

  // same idea as AlbumList: env var for admins
  const adminEmails =
    process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") ?? [];
  const isAdmin = adminEmails.includes(userEmail);

  // turn one FavoriteRow into an Album object for AlbumCard
  const mapFavoriteToAlbum = (fav: FavoriteRow): Album => {
    return {
      id: fav.album_id,
      title: fav.title,
      artist: fav.artist,
      year: fav.year ?? null,
      image: fav.image,
      description: fav.description,
      tracks: [], // not needed here
    };
  };

  // handle clicking "View" / "Edit" inside the card
 const handleAlbumClick = async (album: Album, uri: string) => {
  if (uri === "/delete/") {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${album.title}"?`
    );
    if (!confirmed) return;

    const res = await fetch(`/api/albums/by-id/${album.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete album");
      return;
    }

    // simple way: reload page so the list updates
    window.location.reload();
  } else {
    router.push(uri + album.id);
  }
};


  // load favorites for the current user
  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await get<FavoriteRow[]>("/favorites");
      setFavorites(data);
    } catch (err) {
      console.error("GET /favorites UI error", err);
      setError("Could not load favorites. Make sure you are signed in.");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // remove one favorite, then refresh list
  const handleDelete = async (favoriteId: number) => {
    try {
      await del<{ message: string }>(`/favorites/${favoriteId}`);
      await loadFavorites();
    } catch (err) {
      console.error("DELETE /favorites UI error", err);
    }
  };

  return (
    <main>
      <NavBar />

      <div style={{ padding: "1rem" }}>
        <h1>My Favorites</h1>
        <p>Favorites are tied to the logged-in GitHub account.</p>

        {loading && <p>Loading favorites...</p>}

        {error && !loading && <p>{error}</p>}

        {!loading && !error && favorites.length === 0 && (
          <p>No favorites yet. Open an album and add one.</p>
        )}

        {/* Card grid */}
        {!loading && favorites.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "flex-start",
            }}
          >
            {favorites.map((fav) => {
              const album = mapFavoriteToAlbum(fav);

              return (
                <div
                  key={fav.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                  }}
                >
                  <AlbumCard
                    album={album}
                    onClick={handleAlbumClick}
                    canView={isLoggedIn}
                    canEdit={isAdmin} 
                 />

                  {/* simple remove button under the card */}
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(fav.id)}
                  >
                    Remove Favorite
                  </button>

                  <small>
                    Added: {new Date(fav.created_at).toLocaleString()}
                  </small>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
