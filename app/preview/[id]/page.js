'use client';
import { useEffect } from 'react';

export default function PreviewPage({ params }) {
  useEffect(() => {
    const url = `/api/documents/${params.id}/embed-qr`;
    fetch(url, { method: 'GET', credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.pdf) {
          // Buka PDF di tab baru
          const pdfWindow = window.open();
          if (pdfWindow) {
            pdfWindow.document.write(
              `<iframe src='${data.pdf}' width='100%' height='100%' style='border:none;'></iframe>`
            );
          } else {
            document.body.innerHTML = `<div style="color:red;text-align:center;margin-top:40px">Popup diblokir browser. Izinkan popup untuk preview PDF.</div>`;
          }
        } else {
          document.body.innerHTML = `<div style=\"color:red;text-align:center;margin-top:40px\">${data.error || 'PDF tidak ditemukan'}</div>`;
        }
      })
      .catch(err => {
        document.body.innerHTML = `<div style=\"color:red;text-align:center;margin-top:40px\">${err.message || 'Gagal preview PDF'}</div>`;
      });
  }, [params.id]);

  return (
    <div style={{ color: '#333', textAlign: 'center', marginTop: 40 }}>
      Membuka preview PDF...
    </div>
  );
}