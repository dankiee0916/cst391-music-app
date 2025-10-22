// app/api/albums/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import type { Album, Track } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const raw = params.slug;                 
  const slug = raw.toLowerCase();
  const titleGuess = slug.replace(/-/g, ' '); 

  try {
    const pool = getPool();

    // Find album by normalized title 
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
      return NextResponse.json([]); 
    }

    const album = albumRes.rows[0];

    // Detect which ordering column exists
    const colCheck = await pool.query<{
      exists: boolean;
    }>(
      `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'tracks'
          AND column_name = 'track_number'
      ) AS exists
      `
    );
    const hasTrackNumber = colCheck.rows[0]?.exists === true;
    const orderCol = hasTrackNumber ? 'track_number' : 'number';

    // Fetch tracks using the detected column
    const tracksRes = await pool.query(
      `
      SELECT
        id,
        album_id,
        ${orderCol} AS num,
        title,
        lyrics,
        video_url
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

    // Provide a computed slug so you can see the canonical path
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

    // Return as array
    return NextResponse.json([result]);
  } catch (err) {
    console.error(`GET /api/albums/${raw} error:`, err);
    return NextResponse.json(
      { error: 'Failed to fetch album by slug' },
      { status: 500 }
    );
  }
}
