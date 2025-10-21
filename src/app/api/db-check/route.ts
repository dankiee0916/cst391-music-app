// api/db-check/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

const environment = process.env.NODE_ENV;
const dbUrl = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

export async function GET() {
  try {
    const db = getPool();
    let { rows } = await db.query('select now() as now');
    const now = rows[0]?.now;
    ({ rows } = await db.query('SELECT artist FROM albums LIMIT 1'));
    const artist = rows[0]?.artist;   
    return NextResponse.json({ time: now, artist: artist, message: `Francisco's Database connection successful. Running in ${environment}. DATABASE_URL: ${dbUrl}` }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Database connection failed',
       details: (err as Error).message, message: `Sparks Database connection failed. Running in ${environment}. DATABASE_URL: ${dbUrl}` }, { status: 500 });
  }

}
