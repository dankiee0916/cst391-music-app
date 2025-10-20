// api/db-check/route.ts
import { getPool } from "@/lib/db";
import { NextResponse } from "next/server";

const environment = process.env.NODE_ENV;
const dbUrl = process.env.DATABASE_URL;

export async function GET() {
  try {
    const db = getPool();
    const { rows } = await db.query('select now() as now');
    return NextResponse.json({ time: rows[0], message: 'Database check OK' });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Database connection failed', details: err.message },
      { status: 500 }
    );
  }
}