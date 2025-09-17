import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";

export default async function RedirectPage({ params }) {
  const { shortId } = await params;   // ✅ Await params

  await connectDB();
  const link = await Link.findOne({ shortId });

  if (!link) {
    return <h1>404 - QR not found</h1>;
  }

  redirect(link.destination);
}
