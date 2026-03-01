import React from 'react';
import { Link } from 'react-router-dom';

/**
 * News - 仅展示新闻（紧凑），不再包含“最近文件”这种大量条目。
 * 显示最多 5 条，超出显示“更多新闻”链接（跳转到 /news 页面或帮助文档）。
 */
export default function News({ items = [] }) {
  const list = (items && items.length) ? items : [];
  const visible = list.slice(0, 5);

  if (!visible.length) {
    return <div className="small" style={{ color: 'var(--muted)' }}>暂无新闻</div>;
  }

  return (
    <div>
      <ul className="news-list" style={{ listStyle: 'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap:8, maxHeight: 240, overflow: 'auto' }}>
        {visible.map(it => (
          <li key={it.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 10px', borderRadius:8, background:'#fff', border:'1px solid rgba(11,27,43,0.03)' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13, lineHeight:1.15 }}>{it.title}</div>
              <div className="small" style={{ color:'var(--muted)', marginTop:6 }}>{it.date ? new Date(it.date).toLocaleDateString() : ''}</div>
            </div>
            <div>
              {it.url ? <Link to={it.url} className="btn-ghost" style={{ padding:'6px 10px', fontSize:12 }}>查看</Link>
                     : <button className="btn-ghost" style={{ padding:'6px 10px', fontSize:12 }}>查看</button>}
            </div>
          </li>
        ))}
      </ul>

      {list.length > 5 && (
        <div style={{ marginTop:8, textAlign:'center' }}>
          <Link to="/news" className="btn-ghost" style={{ padding:'6px 12px' }}>更多新闻</Link>
        </div>
      )}
    </div>
  );
}