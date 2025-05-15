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

  const handleDrop = (e) => {
    e.preventDefault();
    if (loading) return;
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onUpload(file);
    } else {
      alert('Please select a PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center gap-4 w-full max-w-md mx-auto border border-gray-200">
      <label className="block w-full text-gray-900 font-semibold text-center">Upload PDF</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer transition hover:border-black bg-gray-50 text-gray-500 mb-2"
        style={{ minHeight: 120 }}
        onClick={() => fileInput.current.click()}
      >
        <span className="text-center select-none">Drag & drop PDF here, or click to select</span>
        <input
          ref={fileInput}
          type="file"
          accept="application/pdf"
          className="hidden"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded bg-black text-white font-bold hover:bg-gray-900 transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Generate Signature'}
      </button>
    </form>
  );
}