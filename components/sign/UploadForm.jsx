'use client';

import React, { useRef, useState } from 'react';

export default function UploadForm({ onUpload, loading }) {
  const fileInput = useRef();
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = fileInput.current.files[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
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
      setFileName(file.name);
      onUpload(file);
    } else {
      alert('Please select a PDF file.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center gap-4 w-full max-w-xl mx-auto border border-gray-200">
      <label className="block w-full text-gray-900 font-semibold text-center">Upload PDF</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer transition hover:border-black bg-gray-50 text-gray-500 mb-2"
        style={{ minHeight: 120, maxWidth: 480 }}
        onClick={() => fileInput.current.click()}
      >
        {fileName ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-center font-medium text-black">{fileName}</span>
            <span className="text-xs text-green-600">File selected</span>
          </div>
        ) : (
          <span className="text-center select-none">Drag & drop PDF here, or click to select</span>
        )}
        <input
          ref={fileInput}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
          required
        />
      </div>
      {fileName && (
        <div className="w-full text-center text-sm text-gray-600 -mt-2 mb-1">
          <span>Selected file: <span className="font-semibold">{fileName}</span></span>
        </div>
      )}
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