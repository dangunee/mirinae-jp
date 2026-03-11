import KaiwaCurriculumClient from "./KaiwaCurriculumClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会話強化クラス｜ミリネ韓国語教室",
  description:
    "会話・音読・発音・小説朗読・語彙力強化で総合的に会話力アップ。初中級・中級1・中級2・上級のテーマ例をご覧ください。",
};

export default function KaiwaPage() {
  return (
    <div className="kaiwa-page">
      <div style={{ background: "var(--white)", padding: "12px 24px", borderBottom: "1px solid var(--gray-border)", display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        <a href="/" style={{ color: "var(--dark)", textDecoration: "none", fontWeight: 500 }}>ホーム</a>
        <a href="/kaiwa.html" style={{ color: "var(--dark)", textDecoration: "none", fontWeight: 500 }}>会話強化クラス（詳細）</a>
      </div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;700&display=swap"
      />
      <style>{`
        .kaiwa-page { --beige:#f5f0e8; --taupe:#BD9962; --gold:#B8963E; --gold-light:#e8d5b0; --gold-pale:#f7f0e3; --dark:#1C1C1E; --white:#FFF; --gray-border:#E5E0D8; --text-dark:#2c2c2c; --text-muted:#8E8E93; --mid:#4a4438; --border:#e4ddd2; }
        .kaiwa-page * { margin:0; padding:0; box-sizing:border-box; }
        .kaiwa-page { font-family:'Noto Sans JP',sans-serif; color:var(--text-dark); line-height:1.8; background:#FAFAF7; }
        .kaiwa-page .page-wrapper { max-width:1200px; margin:0 auto; }
        .kaiwa-page .page-wrapper:has(main) { min-height:100vh; }
        .kaiwa-page .hero, .kaiwa-page .tabs-bar { width:100%; }
        .kaiwa-page .hero { background:var(--white); padding:72px 80px 64px; border-bottom:1px solid var(--gray-border); position:relative; overflow:hidden; text-align:center; }
        .kaiwa-page .hero::after { content:"회화강화"; position:absolute; right:48px; top:50%; transform:translateY(-50%); font-family:'Noto Sans KR',sans-serif; font-size:120px; font-weight:700; color:rgba(184,146,62,0.06); pointer-events:none; user-select:none; white-space:nowrap; }
        .kaiwa-page .hero-eyebrow { font-size:11px; letter-spacing:.25em; text-transform:uppercase; color:var(--gold); margin-bottom:20px; font-weight:500; }
        .kaiwa-page .hero h1 { font-family:'Noto Serif JP',serif; font-size:clamp(32px,4vw,52px); font-weight:300; letter-spacing:.08em; line-height:1.3; margin-bottom:16px; }
        .kaiwa-page .hero p { color:var(--text-muted); font-size:14px; letter-spacing:.05em; }
        .kaiwa-page .tabs-bar { background:var(--white); border-bottom:1px solid var(--gray-border); padding:0 80px; display:flex; gap:0; justify-content:center; }
        .kaiwa-page .tab-btn { padding:16px 28px; font-size:13px; color:var(--text-muted); cursor:pointer; border:none; border-bottom:2px solid transparent; background:none; transition:all .2s; letter-spacing:.05em; white-space:nowrap; user-select:none; font-family:inherit; }
        .kaiwa-page .tab-btn.active { color:var(--gold); border-bottom-color:var(--gold); font-weight:500; }
        .kaiwa-page .tab-btn:hover:not(.active) { color:var(--mid); }
        .kaiwa-page .tab-panel { padding-top:32px; }
        .kaiwa-page .curriculum-section { background:var(--white); border:1px solid var(--border); border-radius:10px; overflow:hidden; margin-bottom:32px; }
        .kaiwa-page .curriculum-header { background:var(--taupe); color:white; padding:14px 24px; font-size:16px; font-weight:600; }
        .kaiwa-page .curriculum-list { display:flex; flex-direction:column; }
        .kaiwa-page .curriculum-item { display:flex; align-items:center; gap:16px; padding:14px 20px; border-bottom:1px solid var(--border); transition:background .15s; }
        .kaiwa-page .curriculum-item:last-child { border-bottom:none; }
        .kaiwa-page .curriculum-item:hover { background:#faf8f4; }
        .kaiwa-page .curriculum-num { width:28px; height:28px; border-radius:50%; background:var(--dark); color:var(--gold-light); font-size:13px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .kaiwa-page .curriculum-theme { font-size:15px; color:var(--mid); }
        .kaiwa-page .section-note { font-size:13px; color:var(--text-muted); margin-top:16px; }
        .kaiwa-page .more-link { display:inline-block; margin-top:24px; color:var(--taupe); font-weight:600; text-decoration:none; font-size:14px; }
        .kaiwa-page .more-link:hover { text-decoration:underline; }
        .kaiwa-page .kaiwa-course-tabs { display:flex; gap:8px; margin-bottom:20px; }
        .kaiwa-page .kaiwa-course-tab { padding:10px 20px; font-size:14px; border:1px solid var(--border); background:var(--white); color:var(--mid); border-radius:8px; cursor:pointer; font-family:inherit; transition:all .2s; }
        .kaiwa-page .kaiwa-course-tab:hover { border-color:var(--gold); color:var(--gold); }
        .kaiwa-page .kaiwa-course-tab.active { background:var(--dark); color:var(--gold-light); border-color:var(--dark); }
        .kaiwa-page .curriculum-item.milestone { background:#faf8f4; border-left:3px solid var(--taupe); }
        @media (max-width:900px) { .kaiwa-page .hero { padding:40px 16px 32px; } .kaiwa-page .hero::after { display:none; } .kaiwa-page .tabs-bar { padding:0 12px; overflow-x:auto; -webkit-overflow-scrolling:touch; justify-content:space-between; flex-wrap:nowrap; } .kaiwa-page .tab-btn { flex:1 1 0; min-width:0; padding:12px 2px; font-size:11px; text-align:center; } }
        @media (max-width:560px) { .kaiwa-page .hero { padding:32px 12px 24px; } .kaiwa-page .tabs-bar { padding:0 8px; } .kaiwa-page .tab-btn { padding:10px 1px; font-size:10px; } .kaiwa-page .curriculum-item { padding:12px 16px; } }
      `}</style>

      <div className="hero">
        <p className="hero-eyebrow">Conversation Enhancement</p>
        <h1>会話強化クラス</h1>
        <p>初級・中級・上級、12コマ・24コマ・48コマで会話トレーニングのカリキュラムをご覧いただけます。</p>
      </div>

      <KaiwaCurriculumClient />

      <div className="page-wrapper" style={{ padding: "0 24px 80px" }}>
        <p className="section-note">※実際のカリキュラムでは約50テーマ以上を扱います。</p>
        <a href="/kaiwa.html" className="more-link">会話強化クラス（音読・発音・小説朗読・語彙力強化）の詳細はこちら →</a>
      </div>
    </div>
  );
}
