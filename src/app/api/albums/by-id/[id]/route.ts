// app/api/albums/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import type { Album, Track } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const idNum = Number(params.id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 });
  }

  try {
    const pool = getPool();

    // Fetch album by ID
    const albumRes = await pool.query('SELECT * FROM albums WHERE id = $1', [idNum]);
    if (albumRes.rowCount === 0) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    const album = albumRes.rows[0];

    // Check whether the tracks table uses 'track_number' or 'number'
    const colCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'tracks'
          AND column_name = 'track_number'
      ) AS exists
    `);
    const hasTrackNumber = colCheck.rows[0]?.exists === true;
    const orderCol = hasTrackNumber ? 'track_number' : 'number';

    // Get all tracks for that album
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

    const result: Album = {
      id: album.id,
      slug: album.title?.toLowerCase().replace(/\s+/g, '-') ?? String(album.id),
      title: album.title,
      artist: album.artist,
      year: album.year,
      image: album.image,
      description: album.description,
      tracks,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error(`GET /api/albums/${params.id} error:`, err);
    return NextResponse.json({ error: 'Failed to fetch album by ID' }, { status: 500 });
  }
}
