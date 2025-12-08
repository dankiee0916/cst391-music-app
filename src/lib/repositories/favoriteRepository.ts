import { getPool } from "@/lib/db";

// get all favorites for one user
export async function getAllFavoritesForUser(email: string) {
  const pool = getPool();

  // pulling album info too so the UI doesn't need a second query
  const query = `
    SELECT
      f.id,
      f.album_id,
      f.created_at,
      a.title,
      a.artist
    FROM favorites f
    JOIN albums a ON f.album_id = a.id
    WHERE f.user_email = $1
    ORDER BY f.created_at DESC;
  `;

  const result = await pool.query(query, [email]);
  return result.rows; // rows = favorites list
}

// add a new favorite for this user
export async function addFavorite(albumId: number, email: string) {
  const pool = getPool();

  // inserting email so favorites are user-specific
  const query = `
    INSERT INTO favorites (album_id, user_email)
    VALUES ($1, $2)
    RETURNING id, album_id, created_at, user_email;
  `;

  const result = await pool.query(query, [albumId, email]);
  return result.rows[0]; // return newly created row
}

// delete a favorite for this user (admin can delete everything)
export async function deleteFavorite(id: number, email: string, isAdmin: boolean) {
  const pool = getPool();

  // if admin can remove anything
  // if user can only delete their own favorites
  const query = isAdmin
    ? `DELETE FROM favorites WHERE id = $1`
    : `DELETE FROM favorites WHERE id = $1 AND user_email = $2`;

  const params = isAdmin ? [id] : [id, email];

 const result = await pool.query(query, params);
  return (result.rowCount ?? 0) > 0; // true if something was actually deleted
}
