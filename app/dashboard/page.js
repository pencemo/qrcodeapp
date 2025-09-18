"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRImg from "@/components/QRImg";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newDestination, setNewDestination] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLinks, setFilteredLinks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth === "true") {
      setIsAuth(true);
    } else {
      router.push("/login"); // redirect if not logged in
    }
  }, [router]);

  // Fetch all links
  async function fetchLinks() {
    const res = await fetch("/api/links");
    const data = await res.json();
    if (data.success) {
      // Generate QR for each link
      const withQR = await Promise.all(
        data.links.map(async (link) => {
          const qrImage = await QRCode.toString(
            `${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortId}`, {
              type: "svg",
              errorCorrectionLevel: "M",
              margin: 1,
              width: 200,
            }
          );
          return { ...link, qrImage };
        })
      );
      setLinks(withQR);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() =>{
    setFilteredLinks(
      links.filter((link) =>
        link.shortId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, links]);

  // Update destination
  async function handleUpdate(id) {
    await fetch(`/api/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination: newDestination }),
    });
    setEditing(null);
    setNewDestination("");
    fetchLinks();
  }

  // Delete QR
  async function handleDelete(id) {
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    fetchLinks();
  }

  function downloadSvg(qr, id) {
    if (!qr) return;
    const blob = new Blob([qr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Qrcode-${id}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const handleDlZip = async()=>{
    const zip = new JSZip();
    for (const link of links) {
      try {
        const svg = link.qrImage
        zip.file(`qr-${link.shortId}.svg`, svg);
      } catch (err) {
        console.error("Failed for", link.shortId, err);
      }
    }
  
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "qrcodes.zip");
  }

  return (
    <div className="p-8 w-full max-w-[90rem] mx-auto">
        <h1 className="text-2xl font-bold ">QR Codes Dashboard</h1>
        <p className="text-sm text-neutral-500">Manage all qr codes and download for usage</p>
      <div className="flex justify-between items-center mt-10 mb-8">
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="border px-4 py-1.5 rounded-md border-neutral-300 placeholder:text-sm w-full max-w-md "
        />
        <div className="space-x-2.5">
          <button onClick={handleDlZip} className="bg-violet-600 cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium shadow">
            Download Zip
          </button>
        <Link href="/">
          <button className="border cursor-pointer border-neutral-300 px-4 py-2 rounded-md text-sm font-medium shadow">
            Back
          </button>
        </Link>
        </div>
      </div>
      <div>
       
        
      </div>
      <div className="rounded-2xl overflow-hidden border border-neutral-300 shadow-md">
      <table className="w-full  ">
        <thead className="">
          <tr className="bg-neutral-100 border-b border-neutral-300">
            <th className="p-3 font-medium  ">No</th>
            <th className="p-3 font-medium bor">Short URL</th>
            <th className="p-3 font-medium bor">Destination</th>
            <th className="p-3 font-medium bor">Actions</th>
            <th className="p-3 font-medium bor">Actions</th>
          </tr>
        </thead>
        <tbody> 
          {filteredLinks.map((link, i) => ( 
            <tr key={link._id} className="text-center border-b border-neutral-200 odd:bg-neutral-50 hover:bg-neutral-100 transition-all duration-300">
              <td className="p-2 font-medium">
                {i+1}
              </td>
              
              <td className="p-2 border-l border-neutral-300 ">
                <a
                  href={`/${link.shortId}`}
                  target="_blank"
                  className="text-blue-700 italic"
                >
                  {process.env.NEXT_PUBLIC_BASE_URL}/{link.shortId}
                </a>
              </td>
              <td className="p-2 border-l border-neutral-300 ">
                {editing === link._id ? (
                  <input
                    className="border-2 border-violet-200   px-3 rounded-md  p-1"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                  />
                ) : (
                  link.destination
                )}
              </td>
              <td className="p-2 border-l border-neutral-300   space-x-3">
                {editing === link._id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(link._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                   <QRImg qrImage={link.qrImage} id={link.shortId}/>
                    <button
                      onClick={() => {
                        setEditing(link._id);
                        setNewDestination(link.destination);
                      }}
                      className="bg-emerald-600 cursor-pointer text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Edit URL
                    </button>
                    {/* <button
                      onClick={() => handleDelete(link._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button> */}

                    {/* ✅ Download QR Button */}
                      <button onClick={()=>downloadSvg(link.qrImage, link.shortId)} className="bg-violet-600 cursor-pointer text-white px-3 py-2 rounded-md text-sm font-medium">
                        Download
                      </button>
                  </>
                )}
              </td>
              <td className="p-2 border-l border-neutral-300 ">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={link.isRedirect}
                  onChange={async () => {
                    const newValue = !link.isRedirect;

                    // ✅ Optimistically update local state
                    setLinks((prev) =>
                      prev.map((l) =>
                        l._id === link._id ? { ...l, isRedirect: newValue } : l
                      )
                    );

                    // ✅ Then call API
                    try {
                      const res = await fetch(`/api/links/${link._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ isRedirect: newValue }),
                      });

                      if (!res.ok) {
                        throw new Error("Failed to update");
                      }

                      const updated = await res.json();

                      // ✅ Ensure state sync with server
                      setLinks((prev) =>
                        prev.map((l) => (l._id === updated._id ? updated : l))
                      );
                    } catch (error) {
                      console.error("Toggle failed", error);

                      // ❌ Rollback if API fails
                      setLinks((prev) =>
                        prev.map((l) =>
                          l._id === link._id ? { ...l, isRedirect: link.isRedirect } : l
                        )
                      );
                    }
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-violet-500 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white  after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
