import React from 'react';
import { NavLink } from 'react-router-dom';
import UserMenu from './UserMenu';

export default function Header({ rawCount = 0, preCount = 0 }) {
  // 始终使用 scrolled 样式（即固定蓝色导航）
  const linkClass = ({ isActive }) => isActive ? 'active' : '';

  return (
    <header className={`header scrolled`} aria-hidden={false}>
      <div className="inner">
        <div className="brand" role="banner">
          <div className="logo" aria-hidden>
            <img src="/logo.png" alt="Database Logo" />
          </div>
          <div className="brand-text">
            <div className="title">自闭症（ASD）脑–肠轴多模态标准数据库</div>
            <div className="subtitle">Autism (ASD) brain–gut axis multimodal database</div>
          </div>
		  
        </div>

        <nav className="nav" aria-label="主导航">
          <NavLink to="/" className={linkClass}>首页</NavLink>
          <NavLink to="/browse" className={linkClass}>浏览</NavLink>
          <NavLink to="/search" className={linkClass}>搜索</NavLink>
          <NavLink to="/download" className={linkClass}>数据下载</NavLink>
          <NavLink to="/docs" className={linkClass}>帮助文档</NavLink>
{/* 登录/用户按钮区域 */}
		  <div className="user-menu" style={{ marginLeft: 16 }}>
		    <UserMenu />
		  </div>
          <NavLink to="/browse?datatype=raw" className="module-btn" style={{ marginLeft: 12 }}>
            原始数据 <span className="badge" style={{ marginLeft:8 }}>{rawCount}</span>
          </NavLink>
          <NavLink to="/browse?datatype=preprocessed" className="module-btn" style={{ marginLeft:8 }}>
            预处理数据 <span className="badge" style={{ marginLeft:8 }}>{preCount}</span>
          </NavLink>
		  
        </nav>
      </div>
    </header>
  );
}