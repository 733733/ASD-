import React from 'react';

export default function Help() {
  return (
    <div className="container">
      <div style={{ display:'flex', gap:20 }}>
        <aside style={{ width:220 }}>
          <div className="card" style={{ position:'sticky', top:92 }}>
            <div style={{ fontWeight:800, marginBottom:8 }}>目录</div>
            <ol style={{ paddingLeft:14, margin:0 }}>
              <li><a href="#intro">1. 一般信息</a></li>
              <li><a href="#browse">2. 浏览</a></li>
              <li><a href="#search">3. 搜索</a></li>
              <li><a href="#download">4. 下载与导出</a></li>
              <li><a href="#data-structure">5. 数据结构与模态</a></li>
              <li><a href="#citation">6. 数据引用与协议</a></li>
              <li><a href="#contact">7. 联系我们</a></li>
              <li><a href="#faq">8. 常见问题</a></li>
            </ol>
          </div>
        </aside>

        <main style={{ flex:1 }}>
          <div className="card fade-in">
            <h2 id="intro">1. 一般信息</h2>
            <p>
              本平台为自闭症（ASD）脑–肠轴多模态标准数据库，整合脑影像、肠道微生物组、代谢组与行为量表等结构化数据与预处理结果，旨在为自闭症相关研究提供标准化、可复现的数据支撑。
            </p>
            <p>本帮助文档说明如何浏览、搜索、筛选、导出数据清单，以及数据使用与引用规范。</p>
          </div>

          <div className="card" style={{ marginTop:12 }}>
            <h3 id="browse">2. 浏览</h3>
            <p>在“浏览”页面你可以：</p>
            <ul>
              <li>按受试者列表查看每位受试者的基本信息（ID、年龄、性别、站点、可用模态）。</li>
              <li>切换为按模态查看模式（例如查看所有 T1、rs-fMRI、metabolomics 等文件）。</li>
              <li>使用左上方的筛选控件：诊断（ASD/TD/Other）、年龄下限等。</li>
            </ul>
            <p>示例操作：选择“按受试者”视图 → 勾选多个受试者 → 点击“导出选中受试者 Manifest”以生成用于批量下载的 manifest 文件。</p>
          </div>

          <div className="card" style={{ marginTop:12 }}>
            <h3 id="search">3. 搜索</h3>
            <p>在“搜索”页面，你可以：</p>
            <ul>
              <li>通过输入受试者 ID、站点名称或诊断关键词进行全文模糊搜索。</li>
              <li>使用年龄区间与诊断筛选结果，支持多选并可批量勾选导出 manifest。</li>
              <li>当搜索结果较多时，可使用浏览页进行分页查看并精细筛选。</li>
            </ul>
          </div>

          <div className="card" style={{ marginTop:12 }}>
            <h3 id="download">4. 下载与导出</h3>
            <p>平台提供两类下载方式：</p>
            <ol>
              <li>单文件下载：在受试者详情页或模态列表中点击下载链接。</li>
              <li>批量下载（manifest）：在“浏览/搜索”页勾选受试者或文件后点击“导出 Manifest (JSON/CSV)”生成下载清单。你可以用该 manifest 配合批量下载脚本或 wget/curl 执行批量下载。</li>
            </ol>
            <p>示例 manifest 格式（JSON）：</p>
            <pre style={{ whiteSpace:'pre-wrap', background:'#fafafa', padding:12, borderRadius:8 }}>
{`[
  {
    "file_id": "f123",
    "participant_id": "P001",
    "file_name": "P001_T1.nii.gz",
    "modality": "T1",
    "download_url": "https://.../P001_T1.nii.gz"
  }
]`}
            </pre>
          </div>

          <div className="card" style={{ marginTop:12 }}>
            <h3 id="data-structure">5. 数据结构与模态</h3>
            <p>平台数据包含以下模态（示例）：</p>
            <ul>
              <li>脑影像：T1, T2, DTI, rs-fMRI 等（通常为 NIfTI 格式）。</li>
              <li>肠道微生物组：16S/shotgun 的 OTU/ASV 表及元数据。</li>
              <li>代谢组：质谱或 NMR 处理后的代谢物定量表。</li>
              <li>行为量表：诊断信息、评估量表得分及采集时间等。</li>
            </ul>
            <p>每个数据文件在平台中包含的元数据字段（示例）：participant_id、file_id、modality、format、size_bytes、download_url、processing_pipeline、qc_flags。</p>
          </div>

          <div className="card" style={{ marginTop:12 }}>
            <h3 id="citation">6. 数据引用与协议</h3>
            <p>使用本数据库的数据请遵守：数据使用协议与署名规范。数据引用示例：</p>
            <p style={{ fontStyle:'italic' }}>作者等., PsycGM ASD Database, 2026. DOI: 10.xxxx/psycgm.asddb</p>
            <p>有合作或对数据的特殊请求（例如受控数据访问）请联系平台管理员并签署相关数据使用协议。</p>
          </div>

          <div className="card" style={{ marginTop:12 }}>
            <h3 id="contact">7. 联系我们</h3>
            <p>如需帮助或合作，请发邮件至：2680240798@qq.com，邮件主题请注明 “ASD 数据库 请求 / 问题”。</p>
          </div>

          <div className="card" style={{ marginTop:12 }}>
            <h3 id="faq">8. 常见问题</h3>
            <dl>
              <dt>Q：如何批量下载所有 T1 文件？</dt>
              <dd>A：在“浏览”页面切换到“按模态”，选择 T1 → 勾选需要的文件 → 导出 manifest → 用脚本批量下载。</dd>

              <dt>Q：为什么下载链接打不开？</dt>
              <dd>A：请确保你有访问该数据的权限，某些受控数据需要登录或授权 token。</dd>

              <dt>Q：如何引用本数据？</dt>
              <dd>A：请按照数据引用与协议 中的示例在论文与报告中注明来源，并标注 DOI。</dd>
            </dl>
          </div>
        </main>
      </div>
    </div>
  );
}