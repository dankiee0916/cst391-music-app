import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { listFavorites, createFavorite } from "@/lib/services/favoriteService";

// GET /api/favorites
// returns ONLY the favorites that belong to the logged-in user
export async function GET() {
  try {
    // checking logged-in user
    const session = await getServerSession(authOptions);

    // if not signed in, guests can't see any favorites
    if (!session?.user?.email) {
      return NextResponse.json({ message: "not authorized" }, { status: 401 });
    }

    const email = session.user.email;

    // use the service layer
    const rows = await listFavorites(email);

    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("GET /favorites error", err);
    return NextResponse.json(
      { message: "Failed to load favorites" },
      { status: 500 }
    );
  }
}

// POST /api/favorites
// adds a favorite tied to the logged-in user's email
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // user must be signed in to add favorites
    if (!session?.user?.email) {
      return NextResponse.json({ message: "not authorized" }, { status: 401 });
    }

    const body = await request.json();
    const { albumId } = body;

    // quick validation
    if (!albumId) {
      return NextResponse.json(
        { message: "albumId is required" },
        { status: 400 }
      );
    }

    const email = session.user.email;

    // create the favorite through service
    const favorite = await createFavorite(albumId, email);

    return NextResponse.json(favorite, { status: 201 });
  } catch (err) {
    console.error("POST /favorites error", err);
    return NextResponse.json(
      { message: "Failed to create favorite" },
      { status: 500 }
    );
  }
}
