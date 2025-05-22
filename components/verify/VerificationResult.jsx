'use client';

import React from 'react';

export default function VerificationResult({ result, error }) {  if (error) {
    return (
      <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-red-200">
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <p className="text-red-600 text-center font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (result === null) {
    return null;
  }

  return (
    <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-black">      <div className="flex items-center justify-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          result.valid ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <p className={`text-center font-medium ${
          result.valid ? 'text-green-600' : 'text-red-600'
        }`}>
          {result.valid ? 'Signature is valid' : 'Signature is invalid'}
        </p>
      </div>
    </div>
  );
}