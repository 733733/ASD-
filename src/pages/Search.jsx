import React, { useEffect, useState } from 'react';
import ParticipantCard from '../components/ParticipantCard';
import { getParticipants } from '../utils/api';

export default function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({});

  async function doSearch() {
    setLoading(true);
    try {
      const res = await getParticipants({ q });
      const filtered = (res || []).filter(p => {
        if (!q) return true;
        const text = (p.participant_id + ' ' + p.site + ' ' + p.diagnosis).toLowerCase();
        return text.includes(q.toLowerCase());
      });
      setResults(filtered);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    doSearch();
    // eslint-disable-next-line
  }, []);

  function handleCheck(id, checked) {
    setSelected(prev => ({ ...prev, [id]: checked }));
  }

  const selectedCount = Object.values(selected).filter(Boolean).length;

  async function exportSelectedManifest(format = 'json') {
    const ids = Object.entries(selected).filter(([k,v]) => v).map(([k]) => k);
    if (ids.length === 0) {
      alert('请先选择至少一个受试者');
      return;
    }
    try {
      const promises = ids.map(id => fetch(`http://localhost:4000/files?participant_id=${encodeURIComponent(id)}`).then(r => r.json()));
      const results = await Promise.all(promises);
      const files = results.flat();
      const manifest = files.map(f => ({
        file_id: f.file_id,
        participant_id: f.participant_id,
        file_name: f.file_name,
        modality: f.modality,
        download_url: f.download_url
      }));
      const blob = format === 'csv'
        ? new Blob([toCSV(manifest)], { type: 'text/csv' })
        : new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `manifest_selected.${format === 'csv' ? 'csv' : 'json'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('导出失败，请查看控制台');
    }
  }

  function toCSV(arr) {
    if (!arr.length) return '';
    const keys = Object.keys(arr[0]);
    const lines = [keys.join(',')].concat(arr.map(o => keys.map(k => `"${String(o[k] ?? '')}"`).join(',')));
    return lines.join('\n');
  }

  return (
    <div className="container">
      <h2>搜索受试者</h2>

      <div className="card">
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input className="select" style={{flex:1}} type="text" placeholder="输入受试者ID、站点或诊断（例如 P001 或 SiteA）" value={q} onChange={e => setQ(e.target.value)} />
          <button className="btn btn-primary" onClick={doSearch}>搜索</button>
        </div>

        <div style={{marginTop:12, display:'flex', gap:8, alignItems:'center'}}>
          <div className="small">{selectedCount} 个已选</div>
          <button className="btn btn-primary" onClick={() => exportSelectedManifest('json')}>导出所选 manifest (JSON)</button>
          <button className="btn btn-ghost" onClick={() => exportSelectedManifest('csv')}>导出 CSV</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading && <div className="small">搜索中...</div>}
        {!loading && results.map(p => (
          <ParticipantCard key={p.participant_id} p={p} checked={selected[p.participant_id]} onCheck={handleCheck} />
        ))}
        {!loading && results.length === 0 && <div className="small">无结果</div>}
      </div>
    </div>
  );
}