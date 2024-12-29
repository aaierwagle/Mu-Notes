import connectDB from "@/lib/database.db";
import Note from "@/models/Note";
import { NextRequest, NextResponse } from "next/server";

// Handle POST requests to add a Note
export async function POST(request: NextRequest) {
    try {
        // const authResponse = await isAuthenticated(req);
        // if (authResponse) return authResponse; // Return early if unauthorized
        
        // Get data from the request body
        const Data = await request.json();
        console.log(Data);

        // Connect to the database
        await connectDB();

        // Save the Note in the database
        await Note.create(Data);

        // Send success response
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error) {
        console.error("Error adding Note:", error); // Log the error for debugging

        // Send error response with more details
        return NextResponse.json(
            { message: "Error adding Note", error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const semester = searchParams.get('semester');
        const subject = searchParams.get('subject');

        let query = {};
        if (semester) query = { ...query, semester: parseInt(semester) };
        if (subject) query = { ...query, subject };

        const Notes = await Note.find(query).sort({ createdAt: -1 });
        return NextResponse.json(Notes);
    } catch (error) {
        console.error("Error fetching Notes:", error); // Log the error for debugging
        return NextResponse.json({ error: 'Failed to fetch Notes' }, { status: 500 });
    }
}
