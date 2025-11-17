import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// DELETE /api/favorites/:id  -> remove a favorite
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const favoriteId = Number(params.id);

  if (Number.isNaN(favoriteId)) {
    return NextResponse.json(
      { message: 'Invalid id' },
      { status: 400 }
    );
  }

  try {
    await sql`DELETE FROM favorites WHERE id = ${favoriteId};`;
    return NextResponse.json({ message: 'deleted' }, { status: 200 });
  } catch (err) {
    console.error('DELETE /favorites error', err);
    return NextResponse.json(
      { message: 'Failed to delete favorite' },
      { status: 500 }
    );
  }
}
