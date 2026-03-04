import React, { useEffect, useState } from 'react';
import ParticipantCard from '../components/ParticipantCard';
import { getParticipants, getFiles, getModalities } from '../utils/api';
import { useLocation } from 'react-router-dom';

export default function Browse() {
  const [participants, setParticipants] = useState([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [minAge, setMinAge] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState({});
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  // modality view
  const [viewMode, setViewMode] = useState('participants'); // 'participants' | 'modality'
  const [modalities, setModalities] = useState([]);
  const [modality, setModality] = useState('');
  const [filesByModality, setFilesByModality] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // read query param for datatype if present
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const datatype = params.get('datatype');
    // preserve datatype if needed; not used as filter here
  }, [location.search]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const ps = await getParticipants();
        setParticipants(ps);
        const ms = await getModalities();
        setModalities(ms);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadFiles() {
      if (viewMode === 'modality' && modality) {
        setLoading(true);
        try {
          const fs = await getFiles({ modality });
          setFilesByModality(fs);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setFilesByModality([]);
      }
    }
    loadFiles();
  }, [viewMode, modality]);

  const filtered = participants.filter(p => {
    if (diagnosis && p.diagnosis !== diagnosis) return false;
    if (minAge && p.age < Number(minAge)) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  function handleCheckParticipant(id, checked) {
    setSelectedParticipants(prev => ({ ...prev, [id]: checked }));
  }

  function handleCheckFile(id, checked) {
    setSelectedFiles(prev => ({ ...prev, [id]: checked }));
  }

  async function exportSelectedParticipants(format = 'json') {const user = JSON.parse(localStorage.getItem('userInfo') || 'null');
  if (!user) {
    alert('请先登录后再下载/导出数据');
    window.location.href = '/login';
    return;
  }
    const ids = Object.entries(selectedParticipants).filter(([k,v]) => v).map(([k]) => k);
    if (ids.length === 0) { alert('请先选择至少一个受试者'); return; }
    try {
      const promises = ids.map(id => getFiles({ participant_id: id }));
      const results = await Promise.all(promises);
      const files = results.flat();
      const manifest = files.map(f => ({
        file_id: f.file_id, participant_id: f.participant_id, file_name: f.file_name, modality: f.modality, download_url: f.download_url
      }));
      downloadBlob(manifest, format, 'manifest_participants');
    } catch (e) { console.error(e); alert('导出失败'); }
  }

  function downloadBlob(manifest, format, prefix) {
    const blob = format === 'csv'
      ? new Blob([toCSV(manifest)], { type: 'text/csv' })
      : new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prefix}.${format === 'csv' ? 'csv' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toCSV(arr) {
    if (!arr.length) return '';
    const keys = Object.keys(arr[0]);
    const lines = [keys.join(',')].concat(arr.map(o => keys.map(k => `"${String(o[k] ?? '')}"`).join(',')));
    return lines.join('\n');
  }

  return (
    <div>
      <div className="card" style={{ marginBottom:12 }}>
        <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <label className="small">视图：</label>
            <select className="select" value={viewMode} onChange={e => setViewMode(e.target.value)}>
              <option value="participants">按受试者</option>
              <option value="modality">按模态</option>
            </select>
          </div>

          {viewMode === 'participants' && (
            <>
              <select className="select" value={diagnosis} onChange={e => setDiagnosis(e.target.value)}>
                <option value="">所有诊断</option>
                <option value="ASD">ASD</option>
                <option value="TD">TD</option>
              </select>
              <input className="select" style={{width:120}} type="number" placeholder="最小年龄" value={minAge} onChange={e => setMinAge(e.target.value)} />
              <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                <button className="btn btn-primary" onClick={() => exportSelectedParticipants('json')}>导出选中受试者 Manifest</button>
              </div>
            </>
          )}

          {viewMode === 'modality' && (
            <>
              <select className="select" value={modality} onChange={e => setModality(e.target.value)}>
                <option value="">选择模态</option>
                {modalities.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </>
          )}
        </div>
      </div>

      <div className="grid-cards">
        {loading && <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spinner" /></div>}
        {!loading && viewMode === 'participants' && pageItems.map(p => (
          <ParticipantCard key={p.participant_id} p={p} checked={!!selectedParticipants[p.participant_id]} onCheck={handleCheckParticipant} />
        ))}
        {!loading && viewMode === 'participants' && filtered.length === 0 && <div className="card">暂无受试者</div>}

        {!loading && viewMode === 'modality' && filesByModality.map(f => (
          <div key={f.file_id} className="card fade-in" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:700 }}>{f.file_name}</div>
              <div className="small">{f.modality} · {f.format}</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <label style={{ display:'flex', alignItems:'center', gap:8 }}>
                <input type="checkbox" checked={!!selectedFiles[f.file_id]} onChange={e => handleCheckFile(f.file_id, e.target.checked)} />
                选择
              </label>
              <a className="btn btn-ghost" href={f.download_url} target="_blank" rel="noreferrer">下载</a>
            </div>
          </div>
        ))}
      </div>

      {/* 分页 */}
      {viewMode === 'participants' && (
        <div style={{ marginTop: 16, display:'flex', justifyContent:'center', gap:8, alignItems:'center' }}>
          <button className="btn btn-ghost" onClick={() => setPage(p => Math.max(1, p-1))}>上一页</button>
          <div className="small">第 {page} / {totalPages} 页</div>
          <button className="btn btn-ghost" onClick={() => setPage(p => Math.min(totalPages, p+1))}>下一页</button>
        </div>
      )}

    </div>
  );
}