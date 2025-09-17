"use client";
import { useState } from "react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");
  const router = useRouter();
  const [isLoading, setLoadign] = useState(false);
  const [isError, setError] = useState("");

  const auth = localStorage.getItem("auth");
  const handleSubmit = () => {
    if (auth === "true") {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  async function generateQR() {
    if (!url) return setError("Please enter a valid URL");
    setLoadign(true);
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
    setLoadign(false);
  }

  return (
    <div className="flex flex-col items-center ">
      <div className="w-full border-b border-gray-200 py-4">
        <div className="flex max-md:flex-col justify-between w-full max-w-6xl mx-auto items-center space-y-4">
          <h1 className="text-2xl p-0 m-0 font-bold">Dynamic QR Code</h1>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2.5 text-sm font-medium rounded-md shadow"
          >
            {auth ? "Dashboard" : "Login"}
          </button>
        </div>
      </div>

      <div className=" w-full justify-center mt-10  flex max-md:flex-col items-center gap-3">
        <input
          className="border py-2 px-4 max-w-80 w-full rounded-md border-neutral-300 shadow-xs"
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={generateQR}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-md shadow text-sm font-medium"
        >
          {isLoading ? "Loading..." : "Generate QR"}
        </button>
      </div>
      {isError && <p className="text-red-500 text-sm mt-2">{isError}</p>}
      {qr && (
        <div className="mt-6 flex flex-col items-center space-y-3 ">
          <img src={qr} className="border border-gray-200 " alt="QR Code" />

          <p className=" text-sm text-gray-600">Scan or share this QR</p>

          {/* ✅ Download Button */}
          <a href={qr} download="qrcode.png">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow">
              Download QR
            </button>
          </a>
        </div>
      )}

    </div>
  );
}
