'use client';

import React from 'react';

export default function QRDisplay({ qr }) {
  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="w-56 h-56 flex items-center justify-center bg-white rounded-lg border border-black">
        {qr ? (
          <img src={qr} alt="QR Code" className="w-48 h-48 object-contain" />
        ) : (
          <span className="text-black">QR code will appear here</span>
        )}
      </div>
    </div>
  );
}