import React from 'react';
import { Link } from 'react-router-dom';

export default function ParticipantCard({ p, checked = false, onCheck = () => {} }) {
  return (
    <div className="card part-card fade-in" role="article" aria-label={`受试者 ${p.participant_id}`}>
      <div className="part-left">
        <div className="avatar">{p.participant_id}</div>
        <div>
          <div style={{fontWeight:800, fontSize:16}}>{p.participant_id} · {p.diagnosis}</div>
          <div className="meta">
            年龄: {p.age} · 性别: {p.sex} · 站点: {p.site}
          </div>
          <div className="small" style={{ marginTop:8 }}>模态: {p.available_modalities?.join(', ')}</div>
        </div>
      </div>

      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <label style={{fontSize:13, color:'#334155', display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
          <input
            type="checkbox"
            checked={!!checked}
            onChange={e => onCheck(p.participant_id, e.target.checked)}
            style={{ width:16, height:16 }}
          />
          选择
        </label>
        <Link to={`/subject/${p.participant_id}`} className="btn btn-ghost">查看详情</Link>
      </div>
    </div>
  );
}