import {
  getAllFavoritesForUser,
  addFavorite,
  deleteFavorite,
} from "@/lib/repositories/favoriteRepository";

// list favorites that belong to this user
export async function listFavorites(email: string) {
  // service could do extra logic later if needed
  return await getAllFavoritesForUser(email);
}

// create a new favorite record
export async function createFavorite(albumId: number, email: string) {
  return await addFavorite(albumId, email);
}

// delete one favorite
export async function removeFavorite(id: number, email: string, isAdmin: boolean) {
  return await deleteFavorite(id, email, isAdmin);
}
