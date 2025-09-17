import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import { nanoid } from "nanoid";

export async function POST(req) {
  try {
    await connectDB();
    const { destination } = await req.json();

    const shortId = nanoid(6);
    const newLink = await Link.create({ shortId, destination });

    return NextResponse.json({
      success: true,
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortId}`,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
    try {
      await connectDB();
      const links = await Link.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, links });
    } catch (err) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }
