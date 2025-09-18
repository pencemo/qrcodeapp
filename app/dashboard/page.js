"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
              width: 100,
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

  return (
    <div className="p-8 w-full max-w-[90rem] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">QR Codes Dashboard</h1>
        <Link href="/">
          <button className="bg-green-600 text-white px-4 py-2 rounded shadow">
            Back
          </button>
        </Link>
      </div>
      <div>
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter destination URL"
          className="border p-2 w-full mb-4"
        />
        
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">QR Code</th>
            <th className="p-2 border">Short URL</th>
            <th className="p-2 border">Destination</th>
            <th className="p-2 border">Actions</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody> 
          {filteredLinks.map((link) => (
            <tr key={link._id} className="text-center">
              <td className="p-2 border">
                <div
        className="mt-4 "
        dangerouslySetInnerHTML={{ __html: link.qrImage }}
        aria-hidden={link.qrImage ? "false" : "true"}
      />
              </td>
              <td className="p-2 border">
                <a
                  href={`/${link.shortId}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  {process.env.NEXT_PUBLIC_BASE_URL}/{link.shortId}
                </a>
              </td>
              <td className="p-2 border">
                {editing === link._id ? (
                  <input
                    className="border p-1"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                  />
                ) : (
                  link.destination
                )}
              </td>
              <td className="p-2 border space-x-2">
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
                    <button
                      onClick={() => {
                        setEditing(link._id);
                        setNewDestination(link.destination);
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    {/* <button
                      onClick={() => handleDelete(link._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button> */}

                    {/* ✅ Download QR Button */}
                      <button onClick={()=>downloadSvg(link.qrImage, link.shortId)} className="bg-purple-600 text-white px-2 py-1 rounded">
                        Download
                      </button>
                  </>
                )}
              </td>
              <td className="p-2 border">
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
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
