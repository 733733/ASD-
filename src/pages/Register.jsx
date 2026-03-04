import React, { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [realName, setRealName] = useState('');
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setTips('');
    if (username === email) {
      setTips('用户名不能和邮箱一样');
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch('http://localhost:3000/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, institution, real_name: realName }),
      });
      const data = await resp.json();
      if (data.code === 0) {
        setTips('注册成功，请前往登录');
        setTimeout(() => window.location.href = '/login', 1000);
      } else {
        setTips(data.msg || '注册失败');
      }
    } catch(err) {
      setTips('网络异常');
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 400, margin: '60px auto' }}>
      <div className="card" style={{padding: 28}}>
        <h2>用户注册</h2>
        <form onSubmit={handleRegister}>
          <input
            className="select"
            style={{ width: '100%', marginBottom: 10 }}
            type="email" placeholder="邮箱 (用于登录)"
            value={email} onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="select"
            style={{ width: '100%', marginBottom: 10 }}
            type="text" placeholder="用户名 (显示昵称)"
            value={username} onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            className="select"
            style={{ width: '100%', marginBottom: 10 }}
            type="text" placeholder="单位/机构 (选填)"
            value={institution} onChange={e => setInstitution(e.target.value)}
          />
          <input
            className="select"
            style={{ width: '100%', marginBottom: 10 }}
            type="text" placeholder="真实姓名 (选填)"
            value={realName} onChange={e => setRealName(e.target.value)}
          />
          <input
            className="select"
            style={{ width: '100%' }}
            type="password" placeholder="密码"
            value={password} onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            className="btn btn-primary"
            style={{width: '100%', marginTop: 12}}
            type="submit"
            disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <div style={{ color:'#d33', minHeight:24, marginTop:8 }}>{tips}</div>
        <div className="small" style={{marginTop:10}}>
          已有账号？ <a href="/login">点此登录</a>
        </div>
      </div>
    </div>
  );
}