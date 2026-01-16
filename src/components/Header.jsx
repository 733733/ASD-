import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ rawCount = 0, preCount = 0 }) {
  return (
    <header className="header">
      <div className="inner">
        <div className="brand">
          <div className="logo">
            <img src="/logo.png" alt="Database Logo" />
          </div>
          <div className="brand-text">
            <div className="title">自闭症（ASD）脑–肠轴多模态标准数据库</div>
            <div className="subtitle">Autism (ASD) brain–gut axis multimodal database</div>
          </div>
        </div>

        <nav className="nav">
          <Link to="/">首页</Link>
          <Link to="/browse">浏览</Link>
          <Link to="/search">搜索</Link>

          <Link to="/browse?datatype=raw" className="module-btn" style={{ marginLeft: 12 }}>
            原始数据 <span className="badge" style={{ marginLeft:8 }}>{rawCount}</span>
          </Link>
          <Link to="/browse?datatype=preprocessed" className="module-btn" style={{ marginLeft:8 }}>
            预处理数据 <span className="badge" style={{ marginLeft:8 }}>{preCount}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}