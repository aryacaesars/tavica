'use client';

import React, { useRef } from 'react';

export default function UploadForm({ onUpload, loading }) {
  const fileInput = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = fileInput.current.files[0];
    if (file && file.type === 'application/pdf') {
      onUpload(file);
    } else {
      alert('Please select a PDF file.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center gap-4 w-full max-w-md mx-auto border border-gray-200 dark:border-gray-700">
      <label className="block w-full text-gray-700 dark:text-gray-200 font-semibold text-center">Upload PDF</label>
      <input
        ref={fileInput}
        type="file"
        accept="application/pdf"
        className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 w-full text-gray-700 dark:text-gray-200"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded bg-gray-800 text-white font-bold hover:bg-gray-700 transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Generate Signature'}
      </button>
    </form>
  );
} 