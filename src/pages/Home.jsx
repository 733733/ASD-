import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getParticipants, getFiles, getModalities } from '../utils/api';
import Hero from '../components/Hero';
import ModalityChart from '../components/ModalityChart';
import News from '../components/News';
import InfoCards from '../components/InfoCards';

export default function 主页() {
  const [stats, setStats] = useState({ participants: 0, files: 0, asd: 0 });
  const [modalityCounts, setModalityCounts] = useState({});
  const [infoItems, setInfoItems] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const ps = await getParticipants();
        const fs = await getFiles();

        // 基本统计
        const asd = (ps || []).filter(p => p.diagnosis === 'ASD').length;
        setStats({ participants: (ps || []).length, files: (fs || []).length, asd });

        // 模态计数（用于右侧模态分布）
        const counts = {};
        (fs || []).forEach(f => { counts[f.modality] = (counts[f.modality] || 0) + 1; });
        setModalityCounts(counts);

        // 四张 Info 卡片：贴合当前平台能力（存储 + 元数据 + 检索导出 + 访问引用）
        setInfoItems([
          {
            title: '原始与标准化预处理数据并存',
            text: '集中保存各模态的原始文件，并在可用时提供标准化/预处理产物与处理元信息，便于不同研究者复现与比较分析。'
          },
          {
            title: '统一元数据与可检索索引',
            text: '为每个文件与受试者记录统一元数据（年龄、性别、站点、诊断、模态等），支持基于元数据的快速筛选与定位。'
          },
          {
            title: '数据类型与模态分级筛选检索',
            text: '检索时可先选择数据类型（原始/预处理）与模态，再按受试者/年龄/诊断等精细筛选。'
          },
          {
            title: '平台使命与服务',
            text: '构建面向 ASD 脑‑肠轴的多模态数据存储与检索平台，提供标准化存储、检索与批量导出功能，为后续研究提供数据基础与可复现性保障。'
          }
        ]);

        // 静态示例新闻（如果你有后端 news API 可替换）
        setNewsItems([
          { id: 'n1', title: '平台演示版上线：新增原始/预处理模块切换与文件导出', date: '2026-01-14', url: '/docs' },
          { id: 'n2', title: '模态统计面板已添加，便于快速查看数据覆盖', date: '2026-01-10', url: '/docs' },
          { id: 'n3', title: '公开数据更新：新增若干受试者的 T1、16S、代谢组文件', date: '2025-12-22', url: '/browse' }
        ]);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  // Quick filter 跳转（将 query 传给 /browse）
  function applyQuickFilter(params) {
    const qs = new URLSearchParams(params).toString();
    navigate(`/browse?${qs}`);
  }

  return (
    <div>
      <div className="container">
        <Hero stats={stats} />

        {/* 四项信息卡片，强调当前平台能力（非模态融合） */}
        <div style={{ marginTop: 18 }}>
          <InfoCards items={infoItems} />
        </div>

        {/* 主区与侧栏：关于 + 快速筛选（主区） / 模态分布 + 新闻（侧栏） */}
        <div style={{ display:'grid', gridTemplateColumns: '1fr 360px', gap:18, marginTop:18 }}>
          <div>
            <div className="card">
              <h3>关于本数据库</h3>
              <p>
                本平台旨在构建国内面向自闭症（ASD）脑‑肠轴的多模态数据存储与检索平台，涵盖脑影像、肠道微生物组、代谢组与行为量表等模态。平台目前聚焦于数据的集中存储与标准化元数据记录；在保留原始数据的同时，对于已有的预处理产物亦同步存档，以便检索与下载。
              </p>

              <div style={{ marginTop: 12 }}>
                <h4>快速筛选</h4>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:8 }}>
                  <button className="btn-ghost" onClick={() => applyQuickFilter({ diagnosis: 'ASD' })}>仅 ASD 受试者</button>
                  <button className="btn-ghost" onClick={() => applyQuickFilter({ modality: 'T1' })}>T1 模态</button>
                  <button className="btn-ghost" onClick={() => applyQuickFilter({ modality: 'rs-fMRI' })}>rs‑fMRI</button>
                  <button className="btn-ghost" onClick={() => applyQuickFilter({ modality: 'metabolomics' })}>代谢组</button>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <h4>数据使用与引用</h4>
                <p className="small">
                  说明：部分数据为受控访问。若需下载受控数据，请在“数据下载”页按指引申请访问；引用示例：作者等., AGBA ASD Database, 2026. DOI: 10.xxxx/agba.asddb。
                </p>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <ModalityChart counts={modalityCounts} />
            <div className="card news-card">
              <h4 style={{ marginTop: 0 }}>新闻</h4>
              <News items={newsItems} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}