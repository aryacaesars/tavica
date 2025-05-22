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

export async function fetchCompletedDocuments() {
  try {
    const res = await fetch('/api/documents/my-documents', { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengambil data dokumen');
    // Filter dokumen dengan status 'completed' dan sort by date (newest first)
    return (Array.isArray(data.documents) ? data.documents : [])
      .filter(doc => doc.status === 'completed')
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 10); // Limit to the 10 most recent completed documents
  } catch (err) {
    return [];
  }
}
