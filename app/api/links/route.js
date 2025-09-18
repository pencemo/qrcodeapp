import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import { nanoid } from "nanoid";

export async function POST(req) {
  try {
    await connectDB();
    const { destination } = await req.json();

    let id = 1101
    const lastLink = await Link.findOne().sort({ createdAt: -1 });

    if(lastLink){
        id = Number(lastLink.shortId) + 1
    }
    const newLink = await Link.create({ shortId: id, destination });

    return NextResponse.json({
      success: true,
      id: newLink.shortId,
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${id}`,
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
