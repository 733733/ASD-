import React from 'react';

/**
 * 简单的模态分布水平条图（纯 CSS 实现）
 * props:
 * - counts: { modalityName: count, ... }
 */
export default function ModalityChart({ counts = {} }) {
  const entries = Object.entries(counts);
  const total = entries.reduce((s, [, v]) => s + (Number(v) || 0), 0) || 1;

  return (
    <div className="modality-chart card" aria-label="模态分布">
      <h4 style={{ marginTop:0 }}>模态分布</h4>
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:8 }}>
        {entries.map(([k, v]) => {
          const pct = Math.round((v / total) * 100);
          return (
            <div key={k} style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ minWidth:88, fontSize:13, color:'var(--muted)' }}>{k}</div>
              <div style={{ flex:1, height:10, background:'#f1f5f9', borderRadius:6, overflow:'hidden' }}>
                <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,var(--accent),var(--accent-2))' }} />
              </div>
              <div style={{ width:46, textAlign:'right', fontWeight:700 }}>{v}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}