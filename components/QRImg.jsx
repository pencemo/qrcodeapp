import React, { useState } from "react";
import { HiOutlineQrCode } from "react-icons/hi2";

function QRImg({ qrImage, id = "" }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="inline-flex"> 
      <div>
        <button
          onClick={() => setOpen(true)}
          className="text-sm cursor-pointer font-medium py-2 px-3 border gap-1 border-neutral-200 shadow rounded-md flex items-center justify-center"
        >
          <span className="max-md:hidden">View QR</span> <HiOutlineQrCode />
        </button>
      </div>
      {isOpen && (
        <div
          className={`fixed inset-0 w-full flex items-center justify-center h-screen bg-black/80 z-50`}
        >
          <div
            onClick={() => setOpen(false)}
            className="absolute w-full h-full  inset-0 z-0"
          ></div>
          <div className="flex justify-center flex-col items-center relative w-full max-w-80 rounded-2xl bg-white p-10">
            <div
              className="absolute right-5 top-5 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-xl font-medium">QR ID : {id}</h1>
            <div
              className="border border-neutral-200 p-2"
              dangerouslySetInnerHTML={{ __html: qrImage }}
              aria-hidden={qrImage ? "false" : "true"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default QRImg;
