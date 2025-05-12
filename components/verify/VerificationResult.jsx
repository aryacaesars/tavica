'use client';

import React from 'react';

export default function VerificationResult({ result, error }) {
  if (error) {
    return (
      <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
      </div>
    );
  }

  if (result === null) {
    return null;
  }

  return (
    <div className={`mt-4 p-4 rounded-lg ${
      result.valid 
        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
    }`}>
      <div className="flex items-center justify-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          result.valid 
            ? 'bg-green-500 dark:bg-green-400' 
            : 'bg-red-500 dark:bg-red-400'
        }`} />
        <p className={`text-center font-medium ${
          result.valid 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {result.valid ? 'Signature is valid' : 'Signature is invalid'}
        </p>
      </div>
    </div>
  );
} 