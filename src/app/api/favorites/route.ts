import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';   // <-- use your shared pool

// GET /api/favorites  -> list all favorites
export async function GET() {
  try {
    const pool = getPool();

    // DEBUG: see which DB we are actually connected to
    const dbInfo = await pool.query('SELECT current_database(), current_schema();');
    console.log('DB info from /favorites:', dbInfo.rows);

    const { rows } = await pool.query(`
      SELECT
        f.id,
        f.album_id,
        f.created_at,
        a.title,
        a.artist
      FROM favorites f
      JOIN albums a ON f.album_id = a.id
      ORDER BY f.created_at DESC;
    `);

    return NextResponse.json(rows, { status: 200 });
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

    const pool = getPool();
    const { rows } = await pool.query(
      `
      INSERT INTO favorites (album_id)
      VALUES ($1)
      RETURNING id, album_id, created_at;
      `,
      [albumId]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error('POST /favorites error', err);
    return NextResponse.json(
      { message: 'Failed to create favorite' },
      { status: 500 }
    );
  }
}
