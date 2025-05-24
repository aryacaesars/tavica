'use client';


export default function PreviewPage({ params }) {

  const handlePreview = () => {
    const url = `/api/documents/${params.id}/embed-qr`;
    const pdfWindow = window.open('', '_blank');
    if (!pdfWindow) {
      alert('Popup diblokir browser. Izinkan popup untuk preview PDF.');
      return;
    }
    fetch(url, { method: 'GET', credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.pdf) {
          pdfWindow.document.write(
            `<iframe src='${data.pdf}' width='100%' height='100%' style='border:none;'></iframe>`
          );
        } else {
          pdfWindow.document.write(
            `<div style=\"color:red;text-align:center;margin-top:40px\">${data.error || 'PDF tidak ditemukan'}</div>`
          );
        }
      })
      .catch(err => {
        pdfWindow.document.write(
          `<div style=\"color:red;text-align:center;margin-top:40px\">${err.message || 'Gagal preview PDF'}</div>`
        );
      });
  };

  return (
    <div style={{ color: '#333', textAlign: 'center', marginTop: 80 }}>
      <button
        style={{
          background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '16px 32px', fontSize: 20, cursor: 'pointer', boxShadow: '0 2px 8px #0001', marginBottom: 24
        }}
        onClick={handlePreview}
      >
        Buka PDF di Tab Baru
      </button>
      <div style={{marginTop: 32, color: '#888', fontSize: 16}}>
        Jika popup diblokir, izinkan popup untuk domain ini lalu klik tombol lagi.
      </div>
    </div>
  );
}