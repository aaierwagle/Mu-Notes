import connectDB from "@/lib/database.db";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// Get the user's profile details from the session
export async function GET( ) {
  try {
    const session = await getServerSession();

    // If session does not have a valid user email, return Unauthorized response
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    // Find the user by their email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Destructure the fields you want to send, excluding `role`
    const { name, semester, image, email } = user;

    // Return the user's profile details as a JSON response
    return NextResponse.json({ name, semester, image, email });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}

// Update the user's profile details
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();

    // If session does not have a valid user email, return Unauthorized response
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    // Find the user by their email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the updated data from the request body
    const updatedData = await req.json();
console.log(updatedData)
    // Remove `role` if it exists in the incoming request
    delete updatedData.role;
    console.log("its deleting")
    // Update the user's profile with the new data
    const updatedUser = await User.findByIdAndUpdate(user._id, updatedData, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
    }

    // Destructure the fields you want to send, excluding `role`
    const { name, semester } = updatedUser;

    // Return the updated user profile as a JSON response
    return NextResponse.json({ name, semester });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
  }
}
