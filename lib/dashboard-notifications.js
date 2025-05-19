// utils/dashboard-notifications.js
export async function fetchPendingDocuments() {
  try {
    const res = await fetch('/api/documents', { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengambil data dokumen');
    // Filter dokumen dengan status 'pending'
    return (Array.isArray(data.documents) ? data.documents : []).filter(doc => doc.status === 'pending');
  } catch (err) {
    return [];
  }
}
