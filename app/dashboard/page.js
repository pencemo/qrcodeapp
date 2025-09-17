"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Link from "next/link";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newDestination, setNewDestination] = useState("");

  // Fetch all links
  async function fetchLinks() {
    const res = await fetch("/api/links");
    const data = await res.json();
    if (data.success) {
      // Generate QR for each link
      const withQR = await Promise.all(
        data.links.map(async (link) => {
          const qrImage = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortId}`);
          return { ...link, qrImage };
        })
      );
      setLinks(withQR);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

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

  return (
    <div className="p-8">
        <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold mb-4">📋 QR Codes Dashboard</h1>
      <Link href="/">
        <button className="bg-green-600 text-white px-4 py-2 rounded shadow">
          Back
        </button>
      </Link>

        </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">QR Code</th>
            <th className="p-2 border">Short URL</th>
            <th className="p-2 border">Destination</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link._id} className="text-center">
              <td className="p-2 border">
                <img src={link.qrImage} alt="QR" width={80} />
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
      <button
        onClick={() => handleDelete(link._id)}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Delete
      </button>

      {/* ✅ Download QR Button */}
      <a href={link.qrImage} download={`qr-${link.shortId}.png`}>
        <button className="bg-purple-600 text-white px-2 py-1 rounded">
          Download
        </button>
      </a>
    </>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
