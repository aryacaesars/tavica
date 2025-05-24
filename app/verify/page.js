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
    try {
      setLoading(true);
      setError('');
      setResult(null);
      
      // Extract QR data from PDF
      const qrData = await extractQRFromPDF(file);
      
      if (!qrData) {
        setError('No QR code found in the document');
        setResult({ valid: false });
        return;
      }

      console.log('Extracted QR data:', qrData);

      // Validate and normalize QR data format
      let parsedQRData;
      try {
        // Parse QR data if it's a string
        parsedQRData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
        console.log('Parsed QR data:', parsedQRData);
        
        // Validate that we have the required fields
        const hasRequiredFields = parsedQRData.hash && parsedQRData.signature && parsedQRData.docId;
        
        if (!hasRequiredFields) {
          // If missing fields, try to extract docId and fetch from API
          if (parsedQRData.docId) {
            console.log('QR data missing some fields, will let API handle it');
          } else {
            throw new Error('QR data missing required fields');
          }
        }
        
      } catch (parseError) {
        console.log('QR data parsing failed:', parseError.message);
        console.log('Raw QR data:', qrData);
        
        // Try to use raw data as docId if it looks like one
        if (typeof qrData === 'string' && qrData.length > 10) {
          parsedQRData = { docId: qrData };
          console.log('Treating as docId:', parsedQRData);
        } else {
          setError('Invalid QR code format - unable to extract document information');
          setResult({ valid: false });
          return;
        }
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      // Send as JSON string to ensure proper format
      formData.append('qrData', JSON.stringify(parsedQRData));

      console.log('Sending to verify API:', JSON.stringify(parsedQRData));

      // Send to verify API
      const response = await fetch('/api/verify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Verify API response:', data);
      
      if (!response.ok) {
        setError(data.error || 'Verification failed');
        setResult({ 
          valid: false, 
          details: data.details || 'Unknown error occurred',
          checks: data.checks || {},
          debug: data.debug || null
        });
        return;
      }

      setResult(data);
    } catch (error) {
      console.error('Verification error:', error);
      setError('Error during verification: ' + error.message);
      setResult({ 
        valid: false,
        details: 'Client-side error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-black mb-8 text-center">
          Verify Document Signature
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col gap-4 border border-black">
          <PDFDropzone onFileSelect={handleFileSelect} loading={loading} />
          
          {loading && (
            <div className="flex items-center justify-center gap-2 text-black">
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