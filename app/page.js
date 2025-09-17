"use client";
import { useState } from "react";
import QRCode from "qrcode";
import Link from "next/link";   // ✅ Import Link

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");

  async function generateQR() {
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination: url }),
    });

    const data = await res.json();
    if (data.success) {
      const qrImage = await QRCode.toDataURL(data.shortUrl);
      setQr(qrImage);
    }
  }

  return (
    <div className="flex flex-col items-center p-8 space-y-6">
      <h1 className="text-2xl font-bold">Dynamic QR Code Generator</h1>

      <input
        className="border p-2 w-80"
        type="text"
        placeholder="Enter destination URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={generateQR}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate QR
      </button>

      {qr && (
  <div className="mt-6 flex flex-col items-center space-y-4">
    <img src={qr} alt="QR Code" />

    <p className="mt-2 text-sm text-gray-600">Scan or share this QR</p>

    {/* ✅ Download Button */}
    <a href={qr} download="qrcode.png">
      <button className="bg-purple-600 text-white px-4 py-2 rounded shadow">
        Download QR
      </button>
    </a>
  </div>
)}


      {/* ✅ Dashboard Button */}
      <Link href="/dashboard">
        <button className="bg-green-600 text-white px-4 py-2 rounded shadow">
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
}
