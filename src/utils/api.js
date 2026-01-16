const API_BASE = 'http://localhost:4000';

async function safeJson(res) {
  if (!res.ok) throw new Error('Network error: ' + res.status);
  return res.json();
}

export async function getParticipants(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/participants?${qs}`);
  return safeJson(res);
}

export async function getParticipantById(id) {
  const res = await fetch(`${API_BASE}/participants?participant_id=${encodeURIComponent(id)}`);
  const arr = await safeJson(res);
  return arr[0] || null;
}

export async function getFiles(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/files?${qs}`);
  return safeJson(res);
}

// get unique modalities from files
export async function getModalities() {
  const files = await getFiles();
  const set = new Set();
  (files || []).forEach(f => {
    if (f.modality) set.add(f.modality);
  });
  return Array.from(set).sort();
}