import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { removeFavorite } from "@/lib/services/favoriteService";

// DELETE /api/favorites/:id
// removes a favorite but only if:
// - it's owned by the logged-in user, OR
// - the user is admin
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // id must be a number
  if (Number.isNaN(Number(id))) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);

    // must be logged in to delete anything
    if (!session?.user?.email) {
      return NextResponse.json({ message: "not authorized" }, { status: 401 });
    }

    const email = session.user.email;
    const isAdmin = (session.user as any).role === "admin";

    // service handles the logic
    const success = await removeFavorite(Number(id), email, isAdmin);

    // nothing matched this ID or user didn't own it
    if (!success) {
      return NextResponse.json({ message: "not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /favorites error", err);
    return NextResponse.json(
      { message: "Failed to delete favorite" },
      { status: 500 }
    );
  }
}
