import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getParticipantById, getFiles } from '../utils/api';

export default function Subject() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const part = await getParticipantById(id);
        setP(part);
        const fs = await getFiles({ participant_id: id });
        setFiles(fs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function exportManifest(format = 'json') {
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
    a.download = `${id}_manifest.${format === 'csv' ? 'csv' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toCSV(arr) {
    if (!arr.length) return '';
    const keys = Object.keys(arr[0]);
    const lines = [keys.join(',')].concat(arr.map(o => keys.map(k => `"${String(o[k] ?? '')}"`).join(',')));
    return lines.join('\n');
  }

  if (loading || !p) return <div className="card">加载中...</div>;

  return (
    <div>
      <div className="card fade-in">
        <h2>受试者详情 · {p.participant_id}</h2>
        <div style={{display:'flex', gap:24, flexWrap:'wrap'}}>
          <div>
            <div className="small">诊断</div>
            <div style={{fontWeight:700}}>{p.diagnosis}</div>
          </div>
          <div>
            <div className="small">年龄</div>
            <div style={{fontWeight:700}}>{p.age}</div>
          </div>
          <div>
            <div className="small">性别</div>
            <div style={{fontWeight:700}}>{p.sex}</div>
          </div>
          <div>
            <div className="small">站点</div>
            <div style={{fontWeight:700}}>{p.site}</div>
          </div>
        </div>
      </div>

      <div className="card fade-in" style={{ marginTop:12 }}>
        <h3>该受试者的数据文件</h3>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div className="small">共 {files.length} 个文件</div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-primary" onClick={() => exportManifest('json')}>导出 Manifest (JSON)</button>
            <button className="btn btn-ghost" onClick={() => exportManifest('csv')}>导出 CSV</button>
          </div>
        </div>

        <ul className="file-list">
          {files.map(f => (
            <li key={f.file_id}>
              <div>
                <div style={{fontWeight:700}}>{f.file_name}</div>
                <div className="small">{f.modality} · {f.format} · {Math.round((f.size_bytes||0)/1024)} KB</div>
              </div>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <a className="btn btn-ghost" href={f.download_url} target="_blank" rel="noreferrer">下载</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}