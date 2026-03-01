import React, { useEffect, useState } from 'react';
import ParticipantCard from '../components/ParticipantCard';
import { getParticipants } from '../utils/api';

export default function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({});
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  async function doSearch() {
    setLoading(true);
    try {
      const res = await getParticipants({ q });
      let filtered = (res || []).filter(p => {
        if (q) {
          const text = (p.participant_id + ' ' + p.site + ' ' + p.diagnosis).toLowerCase();
          if (!text.includes(q.toLowerCase())) return false;
        }
        if (diagnosis && p.diagnosis !== diagnosis) return false;
        if (minAge && p.age < Number(minAge)) return false;
        if (maxAge && p.age > Number(maxAge)) return false;
        return true;
      });
      setResults(filtered);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { doSearch(); }, []); // load once

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
        <div style={{display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'}}>
          <input className="select" style={{flex:'1 1 520px'}} type="text" placeholder="输入受试者ID、站点或诊断（例如 P001 或 SiteA）" value={q} onChange={e => setQ(e.target.value)} />
          <input className="select" style={{width:100}} type="number" placeholder="最小年龄" value={minAge} onChange={e => setMinAge(e.target.value)} />
          <input className="select" style={{width:100}} type="number" placeholder="最大年龄" value={maxAge} onChange={e => setMaxAge(e.target.value)} />
          <select className="select" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} style={{width:160}}>
            <option value="">所有诊断</option>
            <option value="ASD">ASD</option>
            <option value="TD">TD</option>
          </select>

          <div style={{display:'flex', gap:8, marginLeft:'auto', alignItems:'center'}}>
            <button className="btn btn-primary" onClick={doSearch}>
              {loading ? <div className="spinner" /> : '搜索'}
            </button>
            <button className="btn btn-ghost" onClick={() => { setQ(''); setMinAge(''); setMaxAge(''); setDiagnosis(''); setSelected({}); doSearch(); }}>
              清除
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div className="small">结果：{results.length} 条</div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div className="small">已选择：{selectedCount}</div>
          <button className="btn btn-primary" onClick={() => exportSelectedManifest('json')}>导出 Manifest (JSON)</button>
        </div>
      </div>

      <div className="grid-cards">
        {loading && <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spinner" /></div>}
        {!loading && results.map(p => (
          <ParticipantCard key={p.participant_id} p={p} checked={!!selected[p.participant_id]} onCheck={handleCheck} />
        ))}
        {!loading && results.length === 0 && <div className="card">未找到匹配结果。</div>}
      </div>
    </div>
  );
}