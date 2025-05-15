'use client';

import React from 'react';

export default function VerificationResult({ result, error }) {
  if (error) {
    return (
      <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-black">
        <p className="text-black text-center font-medium">{error}</p>
      </div>
    );
  }

  if (result === null) {
    return null;
  }

  return (
    <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-black">
      <div className="flex items-center justify-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          result.valid ? 'bg-black' : 'bg-black'
        }`} />
        <p className="text-center font-medium text-black">
          {result.valid ? 'Signature is valid' : 'Signature is invalid'}
        </p>
      </div>
    </div>
  );
}