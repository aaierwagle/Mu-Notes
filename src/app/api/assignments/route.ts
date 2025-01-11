import connectDB from "@/lib/database.db";
import Assignment from "@/models/Assignment";
import { NextRequest, NextResponse } from "next/server";

// Handle POST requests to add an assignment
export async function POST(request: NextRequest) {
    try {
        // const authResponse = await isAuthenticated(request);
        // if (authResponse) return authResponse; // Return early if unauthorized

        // Get data from the request body
        const Data = await request.json();
        console.log(Data);

        // Connect to the database
        await connectDB();

        // Save the assignment in the database
        await Assignment.create(Data);

        // Send success response
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error) {
        console.error("Error adding assignment:", error);

        // Return error in response with more details about the failure
        return NextResponse.json(
            { message: "Error adding assignment", error: error instanceof Error ? error.message : String(error) },
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
        const chapter = searchParams.get("chapter");  // Add chapter filter
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 10; // Number of notes per page

        let query = {};
        if (semester) query = { ...query, semester: (semester) };
        if (subject) query = { ...query, subject };
        if (chapter) query = { ...query, chapter };  // Add chapter to the query


        const assignments = await Assignment.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)  // Skip the previous pages' data
        .limit(limit); // Limit to the number of notes per page

        
        return NextResponse.json(assignments);
    } catch (error) {
        // Log the error if necessary
        console.error("Error fetching assignments:", error);

        // Send error response with details
        return NextResponse.json({ error: 'Failed to fetch assignments', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}



