'use client';

import React, { useState } from 'react';
import PDFDropzone from '../../components/verify/PDFDropzone';
import VerificationResult from '../../components/verify/VerificationResult';
import { extractQRFromPDF } from '../../lib/pdf-utils';

export default function VerifyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileSelect = async (file) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Extract QR code from PDF
      const qrData = await extractQRFromPDF(file);

      // Verify signature
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash: qrData.hash,
          signature: qrData.signature
        })
      });

      const verificationResult = await response.json();
      
      if (!response.ok) {
        throw new Error(verificationResult.error || 'Verification failed');
      }

      setResult(verificationResult);
    } catch (err) {
      // Ensure we have a proper error message
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during verification';
      console.error('Verification error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Verify Document Signature
        </h1>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col gap-4 border border-gray-200 dark:border-gray-700">
          <PDFDropzone onFileSelect={handleFileSelect} loading={loading} />
          
          {loading && (
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Processing document...</span>
            </div>
          )}
        </div>

        <VerificationResult result={result} error={error} />
      </div>
    </main>
  );
} 