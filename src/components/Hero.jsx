import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero({ stats }) {
  return (
    <div className="hero">
      <div className="inner-hero" style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div className="content">
          <h1>欢迎来到 自闭症（ASD）脑-肠轴多模态标准数据库</h1>
          <p style={{ marginTop: 8, marginBottom: 12, fontSize: 16 }}>
            Autism (ASD) brain-gut axis multimodal database - 汇聚脑影像、肠道微生物组、代谢组与行为量表的结构化数据与预处理结果，
            为自闭症机制研究与精准干预提供标准化的数据支持。
          </p>

          <div className="cta">
            <Link to="/browse" className="btn btn-primary">浏览受试者</Link>
            <Link to="/search" className="btn btn-ghost">快速搜索</Link>
          </div>

          <div className="stats-row" style={{ marginTop: 18 }}>
            <div className="stat">
              <div className="num">{stats?.participants ?? 0}</div>
              <div className="label">受试者</div>
            </div>
            <div className="stat">
              <div className="num">{stats?.files ?? 0}</div>
              <div className="label">数据文件</div>
            </div>
            <div className="stat">
              <div className="num">{stats?.asd ?? 0}</div>
              <div className="label">ASD 受试者</div>
            </div>
          </div>
        </div>

        <div style={{ width: 360, textAlign: 'center' }}>
          <div className="hero-logo">
            <img src="/logo.png" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}