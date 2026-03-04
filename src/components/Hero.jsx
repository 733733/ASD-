import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero({ stats }) {
  return (
    <div className="hero fade-in" role="region" aria-label="主页横幅">
      <div className="hero-grid" style={{ maxWidth: 1120, margin: '0 auto', width: '100%' }}>
        <div className="hero-content">
          <h1>欢迎来到 自闭症（ASD） 脑‑肠轴多模态标准数据库</h1>
          <p className="hero-desc">
            汇聚脑影像、肠道微生物组、代谢组与行为量表的结构化数据与预处理结果，提供标准化的数据支持。
          </p>

          {/* CTA 行：浏览 / 搜索入口（搜索页为独立页面），保持首页简洁 */}
          <div className="hero-cta">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link to="/browse" className="btn btn-primary">浏览受试者</Link>
              <Link to="/search" className="btn btn-ghost">快速搜索</Link>
              <Link to="/docs" className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.06)' }}>帮助文档</Link>
            </div>

            <div style={{ marginLeft: 'auto' }}>
              {/* 保留一处 CTA 对齐，不再放入主页搜索输入，避免突兀 */}
            </div>
          </div>

          {/* 统计卡片组（简洁） */}
          <div className="stat-cards" aria-hidden={false}>
            <div className="stat-card">
              <div className="stat-num">{stats?.participants ?? 0}</div>
              <div className="stat-label">受试者</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{stats?.files ?? 0}</div>
              <div className="stat-label">数据文件</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{stats?.asd ?? 0}</div>
              <div className="stat-label">ASD 受试者</div>
            </div>
          </div>
        </div>

        <div className="hero-logo" aria-hidden>
          <img src="/logo.png" alt="AGBA logo" />
        </div>
      </div>
    </div>
  );
}