// lib/middleware/auth.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import connectDB from "./database.db";
import { User } from "@/models/User";

export async function isAuthenticated() {  // Removed 'req' from the parameter list
  try {
    // Get the session asynchronously
    const session = await getServerSession();

    // If session does not have a valid user email, return Unauthorized response
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Log the session details (optional for debugging)
    console.log("Session user email:", session.user.email);

    // connect to the database
    await connectDB();

    // Query the database to check if the user is an admin
    const user = await User.findOne({ email: session.user.email });

    // If user is not found or is not an admin, return Unauthorized response
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Log the user role (optional for debugging)
    console.log("User is an admin:", user.role);

    // If session is valid and user is an admin, return undefined (no response needed)
    return undefined;

  } catch (error) {
    console.error("Error in authentication check:", error);
    return NextResponse.json({ error: 'Failed to check authentication' }, { status: 500 });
  }
}
