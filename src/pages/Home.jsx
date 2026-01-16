import React, { useEffect, useState } from 'react';
import { getParticipants, getFiles } from '../utils/api';
import Hero from '../components/Hero';

export default function 主页() {
  const [stats, setStats] = useState({ participants: 0, files: 0, asd: 0 });

  useEffect(() => {
    async function load() {
      try {
        const ps = await getParticipants();
        const fs = await getFiles();
        const asd = ps.filter(p => p.diagnosis === 'ASD').length;
        setStats({ participants: ps.length, files: fs.length, asd });
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="container">
        <Hero stats={stats} />

        <div style={{ height: 18 }} />

        <div className="card fade-in">
          <div className="about-wrap">
            <div className="about-text">
              <h3>关于本数据库</h3>
              <p>
                本平台旨在构建一套面向自闭症（ASD）脑–肠轴多模态标准数据库，涵盖脑影像、肠道微生物组、代谢组与行为量表等数据类型。
                平台核心包括：数据标准化与预处理流程、质量控制与元数据规范化、以及原始数据与预处理数据的分层存储与下载服务。
              </p>
              <p>
                我们通过统一的数据流水线对基础数据进行对齐，记录处理的 pipeline 和 QC 指标，使研究者能直接使用经过标准化的预处理数据进行下游分析，同时也保留原始数据以便复现与更深入处理。
                数据分为“原始数据（Raw）”与“预处理数据（Preprocessed）”两个模块，用户可在界面中选择对应模块进行浏览、筛选与导出。
              </p>
              <p className="small">
                使用说明：在“浏览”或“搜索”中选择受试者或模态，查看详情页/弹窗获取文件与处理信息，并可导出下载清单（manifest）用于批量下载或分析。
              </p>
            </div>

            <div className="about-side">
              <div className="card" style={{ width: 320 }}>
                <h4 style={{ marginTop: 0 }}>新闻</h4>
                <div className="small">2026-01-14：PsycGM 前端演示版更新，新增原始/预处理模块切换与文件导出。</div>
              </div>

              <div className="card" style={{ width: 320 }}>
                <h4 style={{ marginTop: 0 }}>数据摘要</h4>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <div className="summary-item"><div className="num">{stats.participants}</div><div className="lbl">受试者</div></div>
                  <div className="summary-item"><div className="num">{stats.files}</div><div className="lbl">数据文件</div></div>
                  <div className="summary-item"><div className="num">{stats.asd}</div><div className="lbl">ASD 受试者</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: 12 }} />

        <div className="card">
          <h3>数据概览</h3>
          <div className="summary-banner">
            <div className="summary-item"><div className="num">脑影像</div><div className="lbl">T1 / DTI / rs-fMRI 等</div></div>
            <div className="summary-item"><div className="num">肠道微生物组</div><div className="lbl">16S / metagenomics</div></div>
            <div className="summary-item"><div className="num">代谢组</div><div className="lbl">质谱数据 (mzML)</div></div>
            <div className="summary-item"><div className="num">行为学</div><div className="lbl">多项量表与临床数据</div></div>
          </div>
        </div>

      </div>
    </div>
  );
}