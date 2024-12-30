import connectDB from "@/lib/database.db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Favorite } from "@/models/Favorite";
import Note from "@/models/Note";
import Assignment from "@/models/Assignment";

export async function GET() {
  try {
    // Step 1: Validate user session
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized: No session found" }, { status: 401 });
    }

    // Step 2: Connect to the database
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Step 3: Retrieve favorites from the database based on the user's email
    let favorites = [];
    try {
      favorites = await Favorite.find({ email: session.user.email })
        .select('noteId assignmentId');
    } catch (favError) {
      console.error("Error fetching favorites:", favError);
      return NextResponse.json({ error: "Failed to retrieve favorites" }, { status: 500 });
    }

    // Step 4: Fetch details for each noteId and assignmentId in parallel
    const favoriteDetails = await Promise.all(
      favorites.map(async (favorite) => {
        let noteDetails = null;
        let assignmentDetails = null;

        try {
          // Fetch note details if noteId exists
          if (favorite.noteId) {
            noteDetails = await Note.findById(favorite.noteId);
          }

          // Fetch assignment details if assignmentId exists
          if (favorite.assignmentId) {
            assignmentDetails = await Assignment.findById(favorite.assignmentId);
          }

        } catch (error) {
          console.error("Error fetching note or assignment details:", error);
        }

        return {
          noteDetails,
          assignmentDetails
        };
      })
    );

    console.log(favoriteDetails)

    // Step 5: Return the list of favorite items with their details
    return NextResponse.json({ favoriteDetails });
    
  } catch (error) {
    // Catch-all for unexpected errors
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
