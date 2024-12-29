import connectDB from "@/lib/database.db";
import Assignment from "@/models/Assignment";
import { NextRequest, NextResponse } from "next/server";

// check sesson login sesson and from these seooon role is admin or


export async function GET(req: NextRequest) {
    try {
      await connectDB();
      const url = new URL(req.url);
      const id = url.pathname.split('/').pop();
    //   console.log(id);
  
      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
      }
      return NextResponse.json(assignment);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to fetch assignment' }, { status: 500 });
    }
  }

export async function PUT(req: NextRequest) {
    try {
      await connectDB();
      const url = new URL(req.url);
      const id = url.pathname.split('/').pop();
      console.log(id);
  
      const data = await req.json();
      const assignment = await Assignment.findByIdAndUpdate(id, data, { new: true });
      if (!assignment) {
        return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
      }
      return NextResponse.json(assignment);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 });
    }
  }

export async function DELETE(req: NextRequest) {
    try {
      await connectDB();
      const url = new URL(req.url);
      const id = url.pathname.split('/').pop();
      console.log(id);
  
      const assignment = await Assignment.findByIdAndDelete(id);
      if (!assignment) {
        return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
    }
  }