import connectDB from "@/lib/database.db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Note from "@/models/Note";
import Assignment from "@/models/Assignment";
import { User } from "@/models/User"; // Import User model to query user data

// Get the user's profile details from the session
export async function GET() {
  try {
    const session = await getServerSession();

    // If session does not have a valid user email, return Unauthorized response
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    // Fetch user data from the database using email to get the semester
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the user's semester from the database
    const { semester } = user;
    
    // Query for the latest notes for the user's semester
    const notes = await Note.find({ semester }).sort({ createdAt: -1 });

    // Query for the latest assignments for the user's semester
    const assignments = await Assignment.find({ semester }).sort({ createdAt: -1 });

    // Return the latest notes and assignments based on the user's semester
    return NextResponse.json({ notes, assignments });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch notes and assignments" }, { status: 500 });
  }
}
