import connectDB from "@/lib/database.db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Favorite } from "@/models/Favorite";

export async function POST(req: NextRequest) {
  try {
    // Validate user session
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    // Parse request body
    const body = await req.json();
    const { assignmentsId, notesId } = body;

    // Validate input: Ensure only one of assignmentsId or notesId is present
    if ((!assignmentsId && !notesId) || (assignmentsId && notesId)) {
      return NextResponse.json(
        { error: "You must provide either assignmentsId or notesId, but not both." },
        { status: 400 }
      );
    }

    // Check if the favorite item already exists
    const existingFavorite = await Favorite.findOne({
      email: session.user.email,
      ...(assignmentsId ? { assignmentId: assignmentsId } : { noteId: notesId }),
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "This item is already in your favorites." },
        { status: 409 } // Conflict status code
      );
    }

    // Save the favorite item
    const favorite = new Favorite({
      email: session.user.email, // Use email for identifying user
      assignmentId: assignmentsId,
      noteId: notesId,
    });

    await favorite.save();

    // Send success response
    return NextResponse.json({
      message: "Item has been added to favorites successfully!",
    });
  } catch (error) {
    console.error("Error saving favorite:", error);
    return NextResponse.json(
      { error: "Failed to save the favorite item" },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    // Validate user session
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    const type = searchParams.get('type');

    if (!itemId || !type) {
      return NextResponse.json(
        { error: "Item ID and type are required." },
        { status: 400 }
      );
    }

    // Check if the item is in favorites
    const filter = type === 'note' ? { noteId: itemId } : { assignmentId: itemId };
    const isFavorited = await Favorite.exists({
      email: session.user.email,
      ...filter,
    });

    return NextResponse.json({ isFavorited: Boolean(isFavorited) });
  } catch (error) {
    console.error("Error fetching favorite status:", error);
    return NextResponse.json(
      { error: "Failed to retrieve favorite status" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Validate user session
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    // Parse request body
    const body = await req.json();
    const { assignmentsId, notesId } = body;

    // Validate input: Ensure only one of assignmentsId or notesId is present
    if ((!assignmentsId && !notesId) || (assignmentsId && notesId)) {
      return NextResponse.json(
        { error: "You must provide either assignmentsId or notesId, but not both." },
        { status: 400 }
      );
    }

    // Determine filter criteria based on input
    const filter = {
      email: session.user.email,
      ...(assignmentsId ? { assignmentId: assignmentsId } : { noteId: notesId }),
    };

    // Remove the favorite item
    const result = await Favorite.findOneAndDelete(filter);

    if (!result) {
      return NextResponse.json(
        { error: "Item not found in favorites." },
        { status: 404 }
      );
    }

    // Send success response
    return NextResponse.json({
      message: "Item has been removed from favorites successfully!",
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "Failed to remove the favorite item" },
      { status: 500 }
    );
  }
}
