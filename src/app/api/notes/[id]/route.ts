// pages/api/notes/[id].ts
import { isAuthenticated } from "@/lib/authorization.ts";
import connectDB from "@/lib/database.db";
import Note from "@/models/Note";
import { NextRequest, NextResponse } from "next/server";

// Wrap API logic with the authentication middleware
export async function GET(req: NextRequest) {
  const authResponse = await isAuthenticated();
  if (authResponse) return authResponse; // Return early if unauthorized

  try {
    // Connect to the database
    await connectDB();

    // Extract the note ID from the request URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    // Find the note by ID
    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Return the note as a JSON response
    return NextResponse.json(note);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authResponse = await isAuthenticated();
  if (authResponse) return authResponse; // Return early if unauthorized

  try {
    await connectDB();

    // Extract the note ID from the request URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const data = await req.json();
    const updatedNote = await Note.findByIdAndUpdate(id, data, { new: true });
    if (!updatedNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResponse = await isAuthenticated();
  if (authResponse) return authResponse; // Return early if unauthorized

  try {
    await connectDB();

    // Extract the note ID from the request URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
