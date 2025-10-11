import CopyToClipboard from "@/components/copyButton";
import {connectDB} from "@/lib/db";
import Link from "@/models/Link";
import { redirect } from "next/navigation";

// ✅ must be default export
export default async function RedirectPage(props) {
  const { shortId } = await props.params;
  await connectDB();

  const link = await Link.findOne({ shortId: shortId });

  if (!link) {
    return <h1>404 - QR not found</h1>;
  }

  if (link.isRedirect) {
    // ✅ Redirect only works in Server Components
    redirect(link.destination);
  }

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortId}`


  // ✅ If isRedirect = false → show a page instead
  return (
    <div className="fixed inset-0 z-[9999] w-full h-screen bg-white">

    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold">📌 QR Link</h1>
      <p className="mt-2 font-medium text-xl">ID : {link.shortId}</p>
      {/* <a
        href={link.destination}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Copy link
      </a> */}
      <CopyToClipboard Link={url}   />
    </div>
    </div>
  );
}
