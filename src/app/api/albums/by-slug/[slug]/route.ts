import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import type { Album, Track } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }  
) {
  const { slug: raw } = await context.params;      
  const slug = raw.toLowerCase();
  const titleGuess = slug.replace(/-/g, ' ');

  try {
    const pool = getPool();

    const albumRes = await pool.query(
      `
      SELECT *
      FROM albums
      WHERE lower(title) = $1
         OR lower(regexp_replace(title, '\\s+', '-', 'g')) = $2
      LIMIT 1
      `,
      [titleGuess, slug]
    );

    if (albumRes.rowCount === 0) {
      return NextResponse.json([]); // empty list if not found
    }

    const album = albumRes.rows[0];

    const colCheck = await pool.query<{ exists: boolean }>(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tracks' AND column_name = 'track_number'
      ) AS exists
    `);
    const orderCol = colCheck.rows[0]?.exists ? 'track_number' : 'number';

    const tracksRes = await pool.query(
      `
      SELECT id, album_id, ${orderCol} AS num, title, lyrics, video_url
      FROM tracks
      WHERE album_id = $1
      ORDER BY ${orderCol}
      `,
      [album.id]
    );

    const tracks: Track[] = tracksRes.rows.map((t: any) => ({
      id: t.id,
      number: t.num ?? null,
      title: t.title,
      lyrics: t.lyrics ?? null,
      video: t.video_url ?? null,
    }));

    const computedSlug =
      album.title?.toLowerCase().replace(/\s+/g, '-') ?? raw;

    const result: Album = {
      slug: computedSlug,
      id: album.id,
      title: album.title,
      artist: album.artist,
      year: album.year,
      image: album.image,
      description: album.description,
      tracks,
    };

    return NextResponse.json([result]); // array for “by slug” route
  } catch (err) {
    console.error(`GET /api/albums/by-slug/${raw} error:`, err);
    return NextResponse.json({ error: 'Failed to fetch album by slug' }, { status: 500 });
  }
}
