'use client'; // Required for client-side functionality

import { useState } from 'react';

export default function CopyToClipboard({Link}) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Fallback copy failed: ', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div>
      <button
        onClick={() => copyToClipboard(Link)}
        className="px-4 py-2 bg-blue-500 mt-2 text-white rounded hover:bg-blue-600"
      >
        {isCopied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}