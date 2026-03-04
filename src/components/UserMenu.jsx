import React, { useEffect, useState } from 'react';

export default function UserMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('userInfo');
    if(u) setUser(JSON.parse(u));
  }, []);

  const logout = () => {
    localStorage.removeItem('userInfo');
    // 若有后端登出API, 可补加fetch
    window.location.href = '/login';
  };


  if (!user) {
    return <a
      href="/login"
      className="btn btn-primary"
      style={{padding:'10px 26px', fontSize:'18px'}}
    >登录</a>
  }
  return (
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <span style={{fontWeight:700}}>你好，{user.username || user.email}</span>
      <button className="btn-ghost" onClick={logout}>退出</button>
    </div>
  )
}