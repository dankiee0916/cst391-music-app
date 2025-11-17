import { NextResponse, NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';

// DELETE /api/favorites/:id  -> remove a favorite
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (Number.isNaN(Number(id))) {
    return NextResponse.json(
      { message: 'Invalid id' },
      { status: 400 }
    );
  }

  try {
    await sql`DELETE FROM favorites WHERE id = ${id};`;
    return NextResponse.json({ message: 'deleted' }, { status: 200 });
  } catch (err) {
    console.error('DELETE /favorites error', err);
    return NextResponse.json(
      { message: 'Failed to delete favorite' },
      { status: 500 }
    );
  }
}
