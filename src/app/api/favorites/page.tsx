"use client";

import { useEffect, useState } from "react";
import { get, del } from "@/lib/apiClient";
import NavBar from "@/app/components/NavBar";

// basic shape of a favorite row coming back from /api/favorites
type FavoriteRow = {
  id: number;
  album_id: number;
  created_at: string;
  title: string;
  artist: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // load favorites for the current user
  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await get<FavoriteRow[]>("/favorites");
      setFavorites(data);
    } catch (err) {
      console.error("GET /favorites UI error", err);
      // simple error message, API already logs details
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
  const handleDelete = async (id: number) => {
    try {
      await del<{ message: string }>(`/favorites/${id}`);
      await loadFavorites();
    } catch (err) {
      console.error("DELETE /favorites UI error", err);
    }
  };

  return (
    <main style={{ padding: "1rem" }}>
      <NavBar />

      <h1>My Favorites</h1>
      <p>Favorites are tied to the logged-in GitHub account.</p>

      {loading && <p>Loading favorites...</p>}

      {error && !loading && <p>{error}</p>}

      {!loading && !error && favorites.length === 0 && (
        <p>No favorites yet. Open an album and add one.</p>
      )}

      {!loading && favorites.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Album</th>
              <th>Artist</th>
              <th>Added</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((fav) => (
              <tr key={fav.id}>
                <td>{fav.title}</td>
                <td>{fav.artist}</td>
                <td>{new Date(fav.created_at).toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(fav.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
