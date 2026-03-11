import NetlessonClient from "./NetlessonClient";
import NetlessonSidebar from "./NetlessonSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "通信講座｜ミリネ韓国語教室",
  description:
    "メール作文・音読トレーニング・TOPIK作文トレーニング など、ご自宅から受講できるオンライン講座のご案内です。",
};

const IFRAME_URLS = {
  writing: "https://writing.mirinae.jp/?embed=1",
  ondoku: "https://ondoku.mirinae.jp/?embed=1",
  topik: "https://writing.mirinae.jp/?tab=topik&embed=1",
} as const;

export default function NetlessonPage() {
  return (
    <div className="netlesson-page">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;700&display=swap"
      />
      <style>{`
        .netlesson-page { --beige:#f5f0e8; --taupe:#BD9962; --gold:#B8963E; --gold-light:#e8d5b0; --gold-pale:#f7f0e3; --dark:#1C1C1E; --white:#FFF; --gray-border:#E5E0D8; --text-dark:#2c2c2c; --text-muted:#8E8E93; --mid:#4a4438; }
        .netlesson-page * { margin:0; padding:0; box-sizing:border-box; }
        .netlesson-page { font-family:'Noto Sans JP',sans-serif; color:var(--text-dark); line-height:1.8; background:#FAFAF7; }
        .netlesson-page .page-wrapper { max-width:1200px; margin:0 auto; }
        .netlesson-page .page-wrapper:has(main) { min-height:100vh; }
        .netlesson-page .hero, .netlesson-page .tabs-bar { width:100%; }
        .netlesson-page .top-bar { background:var(--white); padding:12px 24px; font-size:12px; color:var(--text-muted); display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:16px; border-bottom:1px solid var(--gray-border); }
        .netlesson-page .top-bar a { color:var(--dark); text-decoration:none; font-weight:500; font-size:14px; }
        .netlesson-page .top-bar a:hover { color:var(--gold); }
        .netlesson-page .main-content { padding:0 24px 80px; }
        .netlesson-page .hero { background:var(--white); padding:72px 80px 64px; border-bottom:1px solid var(--gray-border); position:relative; overflow:hidden; text-align:center; }
        .netlesson-page .hero::after { content:"통신강좌"; position:absolute; right:48px; top:50%; transform:translateY(-50%); font-family:'Noto Sans KR',sans-serif; font-size:120px; font-weight:700; color:rgba(184,146,62,0.06); pointer-events:none; user-select:none; white-space:nowrap; }
        .netlesson-page .hero-eyebrow { font-size:11px; letter-spacing:.25em; text-transform:uppercase; color:var(--gold); margin-bottom:20px; font-weight:500; }
        .netlesson-page .hero h1 { font-family:'Noto Serif JP',serif; font-size:clamp(32px,4vw,52px); font-weight:300; letter-spacing:.08em; line-height:1.3; margin-bottom:16px; }
        .netlesson-page .hero p { color:var(--text-muted); font-size:14px; letter-spacing:.05em; }
        .netlesson-page .tabs-bar { background:var(--white); border-bottom:1px solid var(--gray-border); padding:0 80px; display:flex; gap:0; justify-content:center; }
        .netlesson-page .tab-btn { padding:16px 28px; font-size:13px; color:var(--text-muted); cursor:pointer; border:none; border-bottom:2px solid transparent; background:none; transition:all .2s; letter-spacing:.05em; white-space:nowrap; user-select:none; font-family:inherit; }
        .netlesson-page .tab-btn.active { color:var(--gold); border-bottom-color:var(--gold); font-weight:500; }
        .netlesson-page .tab-btn:hover:not(.active) { color:var(--mid); }
        .netlesson-page .tab-panel { padding-top:32px; }
        .netlesson-page .section-header { background:var(--taupe); color:white; padding:16px 24px; font-size:18px; font-weight:600; border-radius:8px 8px 0 0; margin-bottom:0; }
        .netlesson-page .iframe-card { border-radius:0 0 8px 8px; border:1px solid var(--gray-border); border-top:none; background:var(--white); box-shadow:0 8px 24px rgba(0,0,0,.06); padding:18px 20px 24px; }
        .netlesson-page .form-note { font-size:13px; color:var(--text-muted); margin-bottom:16px; }
        .netlesson-page .iframe-wrap { width:100%; min-height:1200px; }
        .netlesson-page .iframe-frame { width:100%; min-height:1200px; height:90vh; border:none; }
        .netlesson-page .iframe-note { margin-top:12px; font-size:12px; color:var(--text-muted); }
        .netlesson-page .group-main-grid { display:grid; grid-template-columns:1fr 300px; gap:32px; align-items:start; }
        .netlesson-page .group-left { min-width:0; }
        .netlesson-page .sidebar { position:sticky; top:80px; padding-top:32px; }
        .netlesson-page .sidebar-promo-card { margin-bottom:20px; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08); display:block; text-decoration:none; background:var(--dark); aspect-ratio:1; background-size:cover; background-position:center; }
        .netlesson-page .sidebar-promo-card:hover { opacity:0.95; }
        .netlesson-page .courses-nav-box { background:var(--white); border:1px solid var(--gray-border); border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.06); }
        .netlesson-page .courses-nav-header { background:var(--dark); padding:20px 18px; color:var(--white); }
        .netlesson-page .courses-nav-label { font-size:10px; letter-spacing:.2em; color:var(--gold-light); margin-bottom:4px; }
        .netlesson-page .courses-nav-title { font-family:'Noto Serif JP',serif; font-size:18px; font-weight:600; }
        .netlesson-page .courses-nav { padding:4px 0; }
        .netlesson-page .nav-group-title { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; color:var(--mid); font-size:12px; font-weight:500; cursor:pointer; transition:background .2s, color .2s; }
        .netlesson-page .nav-group-title:hover { background:var(--gold-pale); color:var(--gold); }
        .netlesson-page .nav-group.open .nav-group-title { color:var(--gold); }
        .netlesson-page .nav-chevron { width:16px; height:16px; border-radius:50%; border:1px solid var(--gray-border); display:flex; align-items:center; justify-content:center; font-size:7px; color:var(--text-muted); transition:transform .25s ease; flex-shrink:0; }
        .netlesson-page .nav-group.open .nav-chevron { transform:rotate(180deg); border-color:var(--gold); background:var(--gold-pale); color:var(--gold); }
        .netlesson-page .nav-items { display:grid; grid-template-rows:0fr; transition:grid-template-rows .28s ease; overflow:hidden; }
        .netlesson-page .nav-group.open .nav-items { grid-template-rows:1fr; }
        .netlesson-page .nav-items-inner { overflow:hidden; background:var(--gold-pale); border-top:1px solid rgba(184,146,62,0.2); }
        .netlesson-page .nav-item { display:flex; align-items:center; gap:8px; padding:8px 14px 8px 18px; font-size:12px; color:var(--mid); text-decoration:none; transition:color .15s, background .15s; border-left:2px solid transparent; }
        .netlesson-page .nav-item::before { content:''; width:4px; height:4px; border-radius:50%; background:var(--gray-border); flex-shrink:0; transition:background .15s, transform .15s; }
        .netlesson-page .nav-item:hover::before { background:var(--gold); transform:scale(1.4); }
        .netlesson-page .nav-item.active::before { background:var(--gold); transform:scale(1.5); }
        .netlesson-page .nav-item:hover { color:var(--gold); background:rgba(255,255,255,0.6); border-left-color:var(--gold); }
        .netlesson-page .nav-item.active { color:var(--gold); background:rgba(255,255,255,0.6); border-left-color:var(--gold); font-weight:500; }
        .netlesson-page .nav-divider { height:1px; background:var(--gray-border); margin:0; }
        .netlesson-page footer { background:#2c2c2c; color:white; padding:48px 24px 24px; }
        .netlesson-page .footer-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:32px; max-width:1200px; margin:0 auto 40px; }
        .netlesson-page .footer-column h4 { font-size:14px; margin-bottom:16px; }
        .netlesson-page .footer-column a { display:block; color:rgba(255,255,255,.8); text-decoration:none; font-size:14px; margin-bottom:8px; }
        .netlesson-page .footer-column a:hover { color:white; }
        .netlesson-page .footer-bottom { text-align:center; padding-top:24px; border-top:1px solid rgba(255,255,255,.1); font-size:13px; }
        @media (max-width:900px) { .netlesson-page .group-main-grid { grid-template-columns:1fr; } .netlesson-page .sidebar { display:none; } .netlesson-page .hero { padding:40px 16px 32px; } .netlesson-page .hero::after { display:none; } .netlesson-page .tabs-bar { padding:0 12px; overflow-x:auto; -webkit-overflow-scrolling:touch; justify-content:space-between; flex-wrap:nowrap; } .netlesson-page .tab-btn { flex:1 1 0; min-width:0; padding:12px 2px; font-size:11px; text-align:center; } }
        @media (max-width:560px) { .netlesson-page .hero { padding:32px 12px 24px; } .netlesson-page .tabs-bar { padding:0 8px; } .netlesson-page .tab-btn { padding:10px 1px; font-size:10px; } }
      `}</style>

      <div className="page-wrapper">
        <div className="top-bar">
          <span style={{ color: "var(--text-muted)" }}>
            東京で韓国語教室をお探しならミリネ韓国語教室 | 定休日: 月曜日
          </span>
          <nav style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px 32px" }}>
            <a href="/">ホーム</a>
            <a href="/about">会社概要</a>
            <a href="/about#tab02">アクセス</a>
            <a href="/trial">お申込み</a>
            <a href="/about#tab03">講師</a>
            <a href="/book">著書</a>
            <a href="/trial#tab04">お問い合わせ</a>
          </nav>
        </div>
      </div>

      <div className="hero">
        <p className="hero-eyebrow">Online Course</p>
        <h1>通信講座</h1>
        <p>メール作文・音読トレーニング・TOPIKトレーニング など、ご自宅から受講できるオンライン講座のご案内です。</p>
      </div>

      <NetlessonClient
        writingUrl={IFRAME_URLS.writing}
        ondokuUrl={IFRAME_URLS.ondoku}
        topikUrl={IFRAME_URLS.topik}
        footer={
          <footer>
            <div className="footer-grid">
              <div className="footer-column">
                <h4>メニュー</h4>
                <a href="/">ホーム</a>
                <a href="/about">会社概要</a>
                <a href="/about#tab02">アクセス</a>
              </div>
              <div className="footer-column">
                <h4>講座</h4>
                <a href="/kojin">個人レッスン</a>
                <a href="/group">グループレッスン</a>
                <a href="/kaiwa">会話強化クラス</a>
                <a href="/special">試験対策講座</a>
                <a href="/syutyu">集中講座</a>
                <a href="/netlesson">通信講座</a>
              </div>
              <div className="footer-column">
                <h4>お申込み</h4>
                <a href="/trial">体験申込</a>
                <a href="/trial#tab02">講座申込</a>
                <a href="/trial#tab04">お問い合わせ</a>
              </div>
              <div className="footer-column">
                <h4>その他</h4>
                <a href="/about#tab03">講師</a>
                <a href="/book">著書</a>
                <a href="/voice">「ミリネ教科書」の音声</a>
                <a href="/cancel">キャンセル規定</a>
              </div>
            </div>
            <div className="footer-bottom">
              Copyright © (株)カオンヌリ All Rights Reserved.
            </div>
          </footer>
        }
      >
        <NetlessonSidebar />
      </NetlessonClient>
    </div>
  );
}
