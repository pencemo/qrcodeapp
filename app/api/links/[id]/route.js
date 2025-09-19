import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { destination, isRedirect } = await req.json();
    
    // Await the params.id before using it
    const { id } = await params;
    
    const updated = await Link.findByIdAndUpdate(
      id,
      { destination, isRedirect },
      { new: true }
    );
    return NextResponse.json({ success: true, updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Link.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
