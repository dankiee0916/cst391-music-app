import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET /api/favorites  -> list all favorites
export async function GET() {
  try {
    const result =
      await sql`SELECT f.id,
                       f.album_id,
                       f.created_at,
                       a.title,
                       a.artist
                 FROM favorites f
                 JOIN albums a ON f.album_id = a.id
                 ORDER BY f.created_at DESC;`;

    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    console.error('GET /favorites error', err);
    return NextResponse.json(
      { message: 'Failed to load favorites' },
      { status: 500 }
    );
  }
}

// POST /api/favorites  -> add a new favorite
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { albumId } = body;

    if (!albumId) {
      return NextResponse.json(
        { message: 'albumId is required' },
        { status: 400 }
      );
    }

    const result =
      await sql`INSERT INTO favorites (album_id)
                VALUES (${albumId})
                RETURNING id, album_id, created_at;`;

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error('POST /favorites error', err);
    return NextResponse.json(
      { message: 'Failed to create favorite' },
      { status: 500 }
    );
  }
}
