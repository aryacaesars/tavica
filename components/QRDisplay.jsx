'use client';

import React from 'react';

export default function QRDisplay({ qr }) {
  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="w-56 h-56 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {qr ? (
          <img src={qr} alt="QR Code" className="w-48 h-48 object-contain" />
        ) : (
          <span className="text-gray-400 dark:text-gray-600">QR code will appear here</span>
        )}
      </div>
    </div>
  );
} 