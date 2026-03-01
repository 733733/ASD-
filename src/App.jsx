import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import 主页 from './pages/Home';
import Browse from './pages/Browse';
import Search from './pages/Search';
import Subject from './pages/Subject';
import Help from './pages/Help';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<主页/>} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/search" element={<Search />} />
          <Route path="/subject/:id" element={<Subject />} />
          <Route path="/download" element={<div className="card">数据下载页面（占位）</div>} />
          <Route path="/docs" element={<Help />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}