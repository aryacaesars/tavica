'use client';

import React from 'react';

export default function QRDisplay({ qr }) {
  return (
    <div className="flex flex-col items-center justify-center mt-2">
      <div className="w-64 h-64 flex items-center justify-center bg-white rounded-xl border border-gray-300 shadow">
        {qr ? (
          <img src={qr} alt="QR Code" className="w-56 h-56 object-contain" />
        ) : (
          <span className="text-gray-400">QR code will appear here</span>
        )}
      </div>
    </div>
  );
}