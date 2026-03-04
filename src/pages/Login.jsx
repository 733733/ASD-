import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setTips('');
    setLoading(true);
    try {
      // 修改为你的后端登录API地址
      const resp = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (data.code === 0) {
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        window.location.href = '/'; // 登录后跳转首页
      } else {
        setTips(data.msg || '登录失败');
      }
    } catch(err) {
      setTips('网络异常');
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 400, margin: '60px auto' }}>
      <div className="card" style={{padding: 28}}>
        <h2>用户登录</h2>
        <form onSubmit={handleLogin}>
          <div style={{ margin: '16px 0' }}>
            <input
              className="select"
              style={{ width: '100%', marginBottom: 10 }}
              type="email" placeholder="邮箱"
              value={email} onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className="select"
              style={{ width: '100%' }}
              type="password" placeholder="密码"
              value={password} onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" style={{width: '100%', marginBottom: 8}} type="submit" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <div style={{ color:'#d33', minHeight:24, marginTop:8 }}>{tips}</div>
        <div className="small" style={{marginTop:10}}>
          没有账号？ <a href="/register">点此注册</a>
        </div>
      </div>
    </div>
  );
}