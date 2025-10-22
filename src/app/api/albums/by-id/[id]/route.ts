import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import type { Album, Track } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }   
) {
  const { id } = await context.params;          
  const albumId = Number(id);
  if (Number.isNaN(albumId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  try {
    const pool = getPool();

    const albumRes = await pool.query('SELECT * FROM albums WHERE id = $1', [albumId]);
    if (albumRes.rowCount === 0) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    const album = albumRes.rows[0];

    // check which column exists for ordering tracks
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
      [albumId]
    );

    const tracks: Track[] = tracksRes.rows.map((t: any) => ({
      id: t.id,
      number: t.num ?? null,
      title: t.title,
      lyrics: t.lyrics ?? null,
      video: t.video_url ?? null,
    }));

    const result: Album = {
      slug: album.title?.toLowerCase().replace(/\s+/g, '-') ?? String(albumId),
      id: album.id,
      title: album.title,
      artist: album.artist,
      year: album.year,
      image: album.image,
      description: album.description,
      tracks,
    };

    return NextResponse.json(result); // object for "by id"
  } catch (err) {
    console.error(`GET /api/albums/by-id/${id} error:`, err);
    return NextResponse.json({ error: 'Failed to fetch album by id' }, { status: 500 });
  }
}
