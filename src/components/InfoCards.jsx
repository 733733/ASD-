import React from 'react';

/**
 * InfoCards: 一组图标 + 简短说明的卡片，类似示例图中的“关键产出 / 应用价值”模块
 * props:
 *  - items: [{ title, text, icon (optional JSX) }]
 */
export default function InfoCards({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="info-cards" aria-label="平台亮点">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {items.map((it, idx) => (
          <div key={idx} className="card info-card" style={{ padding: 18, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, background: 'linear-gradient(180deg, rgba(31,119,180,0.08), rgba(31,119,180,0.03))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {/* 如果传入 icon（JSX），直接渲染；否则使用首字母占位 */}
              <div style={{ fontWeight:800, color: 'var(--accent-dark)' }}>
                {it.icon ? it.icon : (it.title ? it.title.slice(0,1) : '?')}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800 }}>{it.title}</div>
              <div className="small" style={{ marginTop: 6 }}>{it.text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}