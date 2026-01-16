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

  // read query param for datatype if present (not used to filter here but preserved)
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const datatype = params.get('datatype');
    // future: use datatype to filter; for now we just keep it visible
  }, [location.search]);

  useEffect(() => {
    async function load() {
      try {
        const ps = await getParticipants();
        setParticipants(ps);
        const ms = await getModalities();
        setModalities(ms);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadFiles() {
      if (viewMode === 'modality' && modality) {
        try {
          const fs = await getFiles({ modality });
          setFilesByModality(fs);
        } catch (e) {
          console.error(e);
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

  async function exportSelectedParticipants(format = 'json') {
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

  function exportSelectedFiles(format = 'json') {
    const ids = Object.entries(selectedFiles).filter(([k,v]) => v).map(([k]) => k);
    if (ids.length === 0) { alert('请先选择至少一个文件'); return; }
    const files = filesByModality.filter(f => ids.includes(f.file_id));
    const manifest = files.map(f => ({
      file_id: f.file_id, participant_id: f.participant_id, file_name: f.file_name, modality: f.modality, download_url: f.download_url
    }));
    downloadBlob(manifest, format, 'manifest_files');
  }

  function downloadBlob(manifest, format, baseName) {
    const blob = format === 'csv'
      ? new Blob([toCSV(manifest)], { type: 'text/csv' })
      : new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}.${format === 'csv' ? 'csv' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toCSV(arr) {
    if (!arr.length) return '';
    const keys = Object.keys(arr[0]);
    const lines = [keys.join(',')].concat(arr.map(o => keys.map(k => `"${String(o[k] ?? '')}"`).join(',')));
    return lines.join('\n');
  }

  const selectedParticipantCount = Object.values(selectedParticipants).filter(Boolean).length;
  const selectedFileCount = Object.values(selectedFiles).filter(Boolean).length;

  return (
    <div className="container">
      <h2 style={{ marginTop: 8 }}>浏览受试者</h2>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap:'wrap' }}>
          <div>
            <label className="small">视图</label><br />
            <select className="select" value={viewMode} onChange={e => setViewMode(e.target.value)}>
              <option value="participants">按受试者浏览</option>
              <option value="modality">按模态浏览</option>
            </select>
          </div>

          {viewMode === 'participants' && (
            <>
              <div>
                <label className="small">诊断筛选</label><br />
                <select className="select" value={diagnosis} onChange={e => { setDiagnosis(e.target.value); setPage(1); }}>
                  <option value="">全部</option>
                  <option value="ASD">ASD</option>
                  <option value="TD">TD</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="small">最小年龄</label><br />
                <input type="number" className="select" value={minAge} onChange={e => { setMinAge(e.target.value); setPage(1); }} placeholder="例如 6" />
              </div>

              <div style={{ marginLeft: 'auto', display:'flex', gap:8, alignItems:'center' }}>
                <div className="small">{selectedParticipantCount} 个已选</div>
                <button className="btn btn-primary" onClick={() => exportSelectedParticipants('json')}>导出所选 manifest (JSON)</button>
                <button className="btn btn-ghost" onClick={() => exportSelectedParticipants('csv')}>导出 CSV</button>
              </div>
            </>
          )}

          {viewMode === 'modality' && (
            <>
              <div>
                <label className="small">选择模态</label><br />
                <select className="select" value={modality} onChange={e => { setModality(e.target.value); setSelectedFiles({}); }}>
                  <option value="">请选择</option>
                  {modalities.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div style={{ marginLeft: 'auto', display:'flex', gap:8, alignItems:'center' }}>
                <div className="small">{selectedFileCount} 个文件已选</div>
                <button className="btn btn-primary" onClick={() => exportSelectedFiles('json')}>导出所选文件 (JSON)</button>
                <button className="btn btn-ghost" onClick={() => exportSelectedFiles('csv')}>导出 CSV</button>
              </div>
            </>
          )}
        </div>
      </div>

      {viewMode === 'participants' && (
        <div className="card">
          {pageItems.map(p => (
            <div key={p.participant_id} className="fade-in">
              <ParticipantCard p={p} checked={selectedParticipants[p.participant_id]} onCheck={handleCheckParticipant} />
            </div>
          ))}

          <div className="pagination">
            <button className="pager" onClick={() => setPage(1)} disabled={page===1}>首页</button>
            <button className="pager" onClick={() => setPage(prev => Math.max(1, prev-1))} disabled={page===1}>上一页</button>
            <div className="small">第 {page} / {totalPages} 页</div>
            <button className="pager" onClick={() => setPage(prev => Math.min(totalPages, prev+1))} disabled={page===totalPages}>下一页</button>
            <button className="pager" onClick={() => setPage(totalPages)} disabled={page===totalPages}>尾页</button>
          </div>
        </div>
      )}

      {viewMode === 'modality' && (
        <div className="card">
          <h3>模态：{modality || '-'}</h3>
          {!modality && <div className="small">请选择一个模态以查看对应的数据文件</div>}
          {modality && filesByModality.length === 0 && <div className="small">该模态当前无文件</div>}
          {modality && filesByModality.length > 0 && (
            <ul className="file-list" style={{ marginTop: 8 }}>
              {filesByModality.map(f => (
                <li key={f.file_id}>
                  <div>
                    <div style={{ fontWeight:700 }}>{f.file_name}</div>
                    <div className="small">{f.participant_id} · {f.modality} · {f.format}</div>
                  </div>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                      <input type="checkbox" checked={!!selectedFiles[f.file_id]} onChange={e => handleCheckFile(f.file_id, e.target.checked)} />
                      选中
                    </label>
                    <a href={f.download_url} target="_blank" rel="noreferrer" className="btn btn-ghost">下载</a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}