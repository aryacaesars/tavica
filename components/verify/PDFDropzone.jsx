'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function PDFDropzone({ onFileSelect, loading }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: loading
  });
  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-black bg-gray-50' 
          : 'border-gray-300 hover:border-black'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <svg 
          className="w-12 h-12 text-black" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
          />
        </svg>
        <p className="text-black font-medium">
          {loading 
            ? 'Processing...' 
            : isDragActive 
              ? 'Drop the PDF here' 
              : 'Drag & drop a PDF file here, or click to select'
          }
        </p>
        <p className="text-sm text-gray-600">
          Only PDF files are accepted
        </p>
      </div>
    </div>
  );
} 