import React from 'react';

export default function Footer() {
  return (
    <footer style={{ marginTop: 28, padding: 22 }}>
      <div className="container">
        <div className="card" style={{ display:'flex', gap:18, alignItems:'flex-start', justifyContent:'space-between' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight:800, fontSize:16 }}>自闭症（ASD）脑–肠轴多模态数据库</div>
            <div className="small" style={{ marginTop:8 }}>
              © 2024-2026 AGBA。保留所有权利。若需合作或数据访问，请联系：2680240798@qq.com（示例邮箱）。
            </div>
            <div className="small" style={{ marginTop:8 }}>
              数据引用示例：作者等., PsycGM ASD Database, 2026. DOI: 10.xxxx/psycgm.asddb
            </div>
          </div>

          <div style={{ minWidth: 280 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>联系我们</div>
            <div className="small">邮箱: 2680240798@qq.com</div>
            <div className="small" style={{ marginTop:8 }}>项目主页 / 协议 / 数据使用条款：请参见帮助文档页面。</div>
          </div>
        </div>
      </div>
    </footer>
  );
}