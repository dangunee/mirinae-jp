import NetlessonClient from "./NetlessonClient";
import NetlessonNav from "./NetlessonNav";
import NetlessonSidebar from "./NetlessonSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "通信講座｜ミリネ韓国語教室",
  description:
    "メール作文・音読トレーニング・TOPIK作文トレーニング など、ご自宅から受講できるオンライン講座のご案内です。",
};

const IFRAME_URLS = {
  writing: "https://mirinae.jp/writing/?embed=1",
  ondoku: "https://mirinae.jp/ondoku/?embed=1",
  topik: "https://mirinae.jp/writing/?tab=topik&embed=1",
} as const;

export default function NetlessonPage() {
  return (
    <div className="netlesson-page">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+JP:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;700&display=swap"
      />
      <style>{`
        .netlesson-page { --beige:#f5f0e8; --taupe:#BD9962; --gold:#B8963E; --gold-light:#e8d5b0; --gold-pale:#f7f0e3; --dark:#1C1C1E; --white:#FFF; --gray-border:#E5E0D8; --text-dark:#2c2c2c; --text-muted:#8E8E93; --mid:#4a4438; }
        .netlesson-page * { margin:0; padding:0; box-sizing:border-box; }
        .netlesson-page { font-family:'Noto Sans JP',sans-serif; color:var(--text-dark); line-height:1.8; background:#FAFAF7; }
        .netlesson-page .page-wrapper { max-width:1200px; margin:0 auto; }
        .netlesson-page .page-wrapper:has(main) { min-height:100vh; }
        .netlesson-page .hero, .netlesson-page .tabs-bar { width:100%; }
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
        .netlesson-page .footer-inner { max-width:1100px; margin:0 auto; padding:0 24px; }
        .netlesson-page .footer-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:32px; margin-bottom:40px; }
        .netlesson-page .footer-column h4 { font-size:14px; margin-bottom:16px; }
        .netlesson-page .footer-column a { display:block; color:rgba(255,255,255,.8); text-decoration:none; font-size:14px; margin-bottom:8px; }
        .netlesson-page .footer-column a:hover { color:white; }
        .netlesson-page .footer-bottom { text-align:center; padding-top:24px; border-top:1px solid rgba(255,255,255,.1); font-size:13px; }
        @media (max-width:900px) { .netlesson-page .group-main-grid { grid-template-columns:1fr; } .netlesson-page .sidebar { display:none; } .netlesson-page .hero { padding:40px 16px 32px; } .netlesson-page .hero::after { display:none; } .netlesson-page .tabs-bar { padding:0 12px; overflow-x:auto; -webkit-overflow-scrolling:touch; justify-content:space-between; flex-wrap:nowrap; } .netlesson-page .tab-btn { flex:1 1 0; min-width:0; padding:12px 2px; font-size:11px; text-align:center; } }
        @media (max-width:560px) { .netlesson-page .hero { padding:32px 12px 24px; } .netlesson-page .tabs-bar { padding:0 8px; } .netlesson-page .tab-btn { padding:10px 1px; font-size:10px; } }
        /* TOPIK embedded */
        .netlesson-page #tab03.tab-panel { padding-top:32px; }
        .netlesson-page #tab03 .topik-embed { --topik-navy:#0e1c38; --topik-navy-mid:#1a3060; --topik-gold:#c8911e; --topik-gold-lt:#e8b84b; --topik-gold-pale:#fdf5e4; --topik-cream:#faf7f0; --topik-cream-dk:#f0ebe0; --topik-text:#1a1a2a; --topik-text-mid:#4a4438; --topik-muted:#9a9080; --topik-border:rgba(200,145,30,.18); --topik-red:#c0392b; --topik-red-lt:#e05a4a; --topik-red-pale:#fdf1f0; --topik-ink:#1a1225; font-family:'Noto Sans JP',sans-serif; }
        .netlesson-page #tab03 .topik-hero { background:linear-gradient(145deg,#2a1e06 0%,#3d2a08 25%,#1e1508 60%,#0e1c38 100%); position:relative; overflow:hidden; padding:88px 48px 0; margin:0 0 24px 0; border-radius:20px; }
        .netlesson-page #tab03 .topik-hero-lines { position:absolute; inset:0; background:radial-gradient(ellipse 80% 60% at 60% -10%,rgba(232,184,75,.28) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 100% 60%,rgba(200,145,30,.18) 0%,transparent 50%),radial-gradient(ellipse 40% 50% at 0% 80%,rgba(232,184,75,.1) 0%,transparent 50%); }
        .netlesson-page #tab03 .topik-hero::before { content:''; position:absolute; inset:0; background-image:repeating-linear-gradient(-45deg,transparent 0,transparent 28px,rgba(200,145,30,.06) 28px,rgba(200,145,30,.06) 29px); }
        .netlesson-page #tab03 .topik-hero-redline { position:absolute; left:44px; top:0; bottom:0; width:2px; background:linear-gradient(to bottom,transparent,rgba(232,184,75,.5) 30%,rgba(200,145,30,.8) 60%,transparent); }
        .netlesson-page #tab03 .topik-hero-kr { position:absolute; right:40px; bottom:-20px; font-family:'Noto Serif JP',serif; font-size:150px; font-weight:600; color:rgba(232,184,75,.06); letter-spacing:-4px; pointer-events:none; white-space:nowrap; line-height:1; }
        .netlesson-page #tab03 .topik-hero-inner { position:relative; z-index:1; max-width:1080px; margin:0 auto; padding-bottom:0; }
        .netlesson-page #tab03 .topik-breadcrumb { font-size:11px; color:rgba(232,184,75,.4); letter-spacing:.08em; margin-bottom:28px; display:flex; align-items:center; gap:8px; }
        .netlesson-page #tab03 .topik-breadcrumb span { color:rgba(232,184,75,.2); }
        .netlesson-page #tab03 .topik-hero-top { display:grid; grid-template-columns:1fr 260px; gap:56px; align-items:start; padding-bottom:64px; }
        .netlesson-page #tab03 .topik-hero-eyebrow { font-family:'Bebas Neue',sans-serif; font-size:12px; letter-spacing:.4em; color:var(--topik-gold-lt); display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .netlesson-page #tab03 .topik-hero-eyebrow::before { content:''; width:28px; height:1px; background:var(--topik-gold); }
        .netlesson-page #tab03 .topik-hero-badge { display:inline-flex; align-items:center; gap:8px; margin-bottom:16px; background:rgba(200,145,30,.15); border:1px solid rgba(200,145,30,.35); color:var(--topik-gold-lt); font-size:12px; letter-spacing:.05em; padding:6px 16px; border-radius:100px; font-family:'Bebas Neue',sans-serif; }
        .netlesson-page #tab03 .topik-hero-title { font-family:'Noto Serif JP',serif; font-size:clamp(26px,3.8vw,50px); color:#fff; line-height:1.2; margin-bottom:12px; font-weight:400; }
        .netlesson-page #tab03 .topik-hero-title em { color:var(--topik-gold-lt); font-style:italic; }
        .netlesson-page #tab03 .topik-hero-catch { font-size:14px; color:rgba(255,255,255,.55); line-height:1.9; margin-bottom:32px; max-width:500px; }
        .netlesson-page #tab03 .topik-hero-chips { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:36px; }
        .netlesson-page #tab03 .topik-chip { display:inline-flex; align-items:center; gap:6px; background:rgba(200,145,30,.1); border:1px solid rgba(200,145,30,.22); border-radius:100px; padding:7px 16px; font-size:12px; color:rgba(255,255,255,.75); letter-spacing:.04em; }
        .netlesson-page #tab03 .topik-hero-btns { display:flex; gap:16px; align-items:center; }
        .netlesson-page #tab03 .topik-btn-primary { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,var(--topik-gold),var(--topik-gold-lt)); color:var(--topik-navy); font-family:'Noto Serif JP',serif; font-size:15px; font-weight:600; padding:15px 36px; border-radius:100px; text-decoration:none; letter-spacing:.05em; transition:all .25s; box-shadow:0 4px 20px rgba(200,145,30,.4); }
        .netlesson-page #tab03 .topik-btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(200,145,30,.55); }
        .netlesson-page #tab03 .topik-btn-ghost { color:rgba(232,184,75,.6); font-size:13px; text-decoration:none; border-bottom:1px solid rgba(232,184,75,.3); padding-bottom:2px; transition:all .2s; }
        .netlesson-page #tab03 .topik-btn-ghost:hover { color:var(--topik-gold-lt); border-color:var(--topik-gold-lt); }
        .netlesson-page #tab03 .topik-hero-price-card { background:rgba(200,145,30,.08); border:1px solid rgba(200,145,30,.3); border-radius:20px; padding:28px 24px; position:relative; overflow:hidden; backdrop-filter:blur(2px); }
        .netlesson-page #tab03 .topik-hero-price-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--topik-gold),var(--topik-gold-lt)); }
        .netlesson-page #tab03 .topik-hpc-ey { font-family:'Bebas Neue',sans-serif; font-size:10px; letter-spacing:.3em; color:var(--topik-gold); margin-bottom:8px; }
        .netlesson-page #tab03 .topik-hpc-name { font-family:'Noto Serif JP',serif; font-size:14px; color:rgba(255,255,255,.7); margin-bottom:18px; line-height:1.5; }
        .netlesson-page #tab03 .topik-hpc-row { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; }
        .netlesson-page #tab03 .topik-hpc-row .k { font-size:11px; color:rgba(255,255,255,.35); }
        .netlesson-page #tab03 .topik-hpc-row .v { font-family:'Cormorant Garamond',serif; font-size:18px; color:rgba(255,255,255,.75); }
        .netlesson-page #tab03 .topik-hpc-total { display:flex; justify-content:space-between; align-items:baseline; padding-top:14px; margin-top:6px; border-top:1px solid rgba(200,145,30,.25); }
        .netlesson-page #tab03 .topik-hpc-total .tl { font-size:11px; color:rgba(255,255,255,.35); }
        .netlesson-page #tab03 .topik-hpc-total .tv { font-family:'Cormorant Garamond',serif; font-size:32px; color:var(--topik-gold-lt); }
        .netlesson-page #tab03 .topik-hpc-note { font-size:10.5px; color:rgba(232,184,75,.35); line-height:1.7; margin-top:12px; }
        .netlesson-page #tab03 .topik-section { padding:72px 48px; }
        .netlesson-page #tab03 .topik-section-inner { max-width:1080px; margin:0 auto; }
        .netlesson-page #tab03 .topik-sec-ey { font-family:'Bebas Neue',sans-serif; font-size:11px; letter-spacing:.4em; color:var(--topik-gold); display:flex; align-items:center; gap:10px; margin-bottom:10px; }
        .netlesson-page #tab03 .topik-sec-ey::after { content:''; width:48px; height:1px; background:var(--topik-gold); opacity:.5; }
        .netlesson-page #tab03 .topik-sec-title { font-family:'Noto Serif JP',serif; font-size:clamp(22px,3vw,32px); color:var(--topik-text); margin-bottom:6px; font-weight:400; line-height:1.4; }
        .netlesson-page #tab03 .topik-sec-desc { font-size:13px; color:var(--topik-muted); line-height:1.9; max-width:580px; }
        .netlesson-page #tab03 .topik-about-section { background:#fff; }
        .netlesson-page #tab03 .topik-about-grid { display:flex; flex-direction:column; gap:28px; margin-top:40px; }
        .netlesson-page #tab03 .topik-about-lead { background:linear-gradient(135deg,var(--topik-red-pale),rgba(253,241,240,.3)); border:1px solid rgba(192,57,43,.15); border-radius:18px; padding:32px 36px; position:relative; overflow:hidden; }
        .netlesson-page #tab03 .topik-about-lead::before { content:'쓰기'; position:absolute; right:28px; bottom:-16px; font-family:'Noto Serif JP',serif; font-size:110px; font-weight:600; color:rgba(192,57,43,.05); pointer-events:none; }
        .netlesson-page #tab03 .topik-about-lead p { font-family:'Noto Serif JP',serif; font-size:16px; color:var(--topik-text); line-height:2; position:relative; z-index:1; }
        .netlesson-page #tab03 .topik-about-lead strong { color:var(--topik-red); }
        .netlesson-page #tab03 .topik-detail-table { background:var(--topik-cream); border:1px solid var(--topik-border); border-radius:18px; overflow:hidden; }
        .netlesson-page #tab03 .topik-dt-row { display:grid; grid-template-columns:100px 1fr; border-bottom:1px solid rgba(200,145,30,.1); }
        .netlesson-page #tab03 .topik-dt-row:last-child { border-bottom:none; }
        .netlesson-page #tab03 .topik-dt-lbl { padding:18px 20px; background:rgba(14,28,56,.04); border-right:1px solid rgba(200,145,30,.1); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; text-align:center; }
        .netlesson-page #tab03 .topik-dt-lbl-icon { font-size:16px; }
        .netlesson-page #tab03 .topik-dt-lbl-text { font-family:'Noto Serif JP',serif; font-size:11px; color:var(--topik-navy); font-weight:600; letter-spacing:.04em; }
        .netlesson-page #tab03 .topik-dt-val { padding:18px 24px; font-size:13px; color:var(--topik-text-mid); line-height:1.85; }
        .netlesson-page #tab03 .topik-dt-val a { color:var(--topik-red); text-decoration:none; border-bottom:1px solid rgba(192,57,43,.25); }
        .netlesson-page #tab03 .topik-flow-highlight { background:var(--topik-red-pale); border:1px solid rgba(192,57,43,.15); border-radius:10px; padding:12px 16px; font-size:12px; color:var(--topik-red); line-height:1.75; margin-top:8px; }
        .netlesson-page #tab03 .topik-features-section { background:var(--topik-cream); }
        .netlesson-page #tab03 .topik-steps-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-top:40px; }
        .netlesson-page #tab03 .topik-step-card { background:#fff; border:1px solid var(--topik-border); border-radius:18px; padding:24px 20px; position:relative; overflow:hidden; transition:transform .28s,box-shadow .28s; }
        .netlesson-page #tab03 .topik-step-card:hover { transform:translateY(-4px); box-shadow:0 14px 40px rgba(14,28,56,.09); }
        .netlesson-page #tab03 .topik-step-card::after { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--topik-red),var(--topik-red-lt)); }
        .netlesson-page #tab03 .topik-step-num { font-family:'Bebas Neue',sans-serif; font-size:10px; letter-spacing:.3em; color:var(--topik-red); margin-bottom:12px; }
        .netlesson-page #tab03 .topik-step-icon { width:48px; height:48px; border-radius:12px; background:linear-gradient(135deg,var(--topik-red),var(--topik-red-lt)); display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:14px; box-shadow:0 4px 14px rgba(192,57,43,.25); }
        .netlesson-page #tab03 .topik-step-card h3 { font-family:'Noto Serif JP',serif; font-size:14px; font-weight:600; color:var(--topik-text); margin-bottom:8px; line-height:1.5; }
        .netlesson-page #tab03 .topik-step-card p { font-size:12px; color:var(--topik-text-mid); line-height:1.85; }
        .netlesson-page #tab03 .topik-steps-row2 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:16px; }
        .netlesson-page #tab03 .topik-sample-section { background:#fff; }
        .netlesson-page #tab03 .topik-sample-wrap { margin-top:40px; background:linear-gradient(145deg,#2a1e06 0%,#1e1508 100%); border:1px solid rgba(200,145,30,.3); border-radius:20px; overflow:hidden; box-shadow:0 8px 40px rgba(0,0,0,.18),inset 0 1px 0 rgba(232,184,75,.12); }
        .netlesson-page #tab03 .topik-sample-head { background:linear-gradient(135deg,rgba(200,145,30,.18),rgba(200,145,30,.05)); border-bottom:1px solid rgba(200,145,30,.18); padding:20px 32px; display:flex; align-items:center; gap:12px; }
        .netlesson-page #tab03 .topik-sample-head-badge { background:rgba(200,145,30,.2); border:1px solid rgba(232,184,75,.35); color:var(--topik-gold-lt); font-family:'Bebas Neue',sans-serif; font-size:10px; letter-spacing:.3em; padding:4px 12px; border-radius:100px; }
        .netlesson-page #tab03 .topik-sample-head-title { font-family:'Noto Serif JP',serif; font-size:14px; color:rgba(255,255,255,.6); }
        .netlesson-page #tab03 .topik-sample-note { padding:12px 32px; background:rgba(200,145,30,.06); border-bottom:1px solid rgba(200,145,30,.12); font-size:12px; color:rgba(232,184,75,.5); line-height:1.7; }
        .netlesson-page #tab03 .topik-sample-body { padding:28px 32px; }
        .netlesson-page #tab03 .topik-sample-theme { margin-bottom:24px; }
        .netlesson-page #tab03 .topik-sample-theme-label { font-family:'Bebas Neue',sans-serif; font-size:10px; letter-spacing:.3em; color:var(--topik-gold); margin-bottom:8px; }
        .netlesson-page #tab03 .topik-sample-theme-text { font-family:'Noto Serif JP',serif; font-size:15px; color:rgba(255,255,255,.8); line-height:1.85; padding:20px 24px; background:rgba(200,145,30,.06); border:1px solid rgba(200,145,30,.18); border-radius:12px; }
        .netlesson-page #tab03 .topik-sample-qs { display:flex; flex-direction:column; gap:10px; }
        .netlesson-page #tab03 .topik-sample-q { display:flex; align-items:flex-start; gap:12px; background:rgba(200,145,30,.08); border:1px solid rgba(200,145,30,.18); border-radius:10px; padding:14px 18px; }
        .netlesson-page #tab03 .topik-sq-num { width:26px; height:26px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,var(--topik-gold),var(--topik-gold-lt)); color:var(--topik-navy); font-family:'Bebas Neue',sans-serif; font-size:12px; display:flex; align-items:center; justify-content:center; }
        .netlesson-page #tab03 .topik-sq-text { font-size:13px; color:rgba(255,255,255,.7); line-height:1.7; padding-top:3px; }
        .netlesson-page #tab03 .topik-price-section { background:var(--topik-cream); }
        .netlesson-page #tab03 .topik-price-card { margin-top:40px; background:linear-gradient(145deg,#2a1e06 0%,#1e1508 100%); border:1px solid rgba(200,145,30,.3); border-radius:20px; overflow:hidden; display:grid; grid-template-columns:1fr 1fr; box-shadow:0 8px 40px rgba(0,0,0,.18),inset 0 1px 0 rgba(232,184,75,.12); }
        .netlesson-page #tab03 .topik-pc-left { background:linear-gradient(145deg,rgba(200,145,30,.15) 0%,rgba(200,145,30,.05) 100%); border-right:1px solid rgba(200,145,30,.18); padding:40px; position:relative; overflow:hidden; }
        .netlesson-page #tab03 .topik-pc-left::before { content:'₩'; position:absolute; right:-10px; bottom:-20px; font-size:160px; color:rgba(200,145,30,.06); font-family:'Cormorant Garamond',serif; }
        .netlesson-page #tab03 .topik-pc-ey { font-family:'Bebas Neue',sans-serif; font-size:10px; letter-spacing:.35em; color:var(--topik-gold); margin-bottom:10px; }
        .netlesson-page #tab03 .topik-pc-name { font-family:'Noto Serif JP',serif; font-size:20px; color:rgba(255,255,255,.9); margin-bottom:24px; line-height:1.4; font-weight:400; }
        .netlesson-page #tab03 .topik-pc-rows { display:flex; flex-direction:column; gap:10px; margin-bottom:20px; }
        .netlesson-page #tab03 .topik-pc-row { display:flex; justify-content:space-between; align-items:baseline; }
        .netlesson-page #tab03 .topik-pc-row .k { font-size:11px; color:rgba(255,255,255,.35); }
        .netlesson-page #tab03 .topik-pc-row .v { font-family:'Cormorant Garamond',serif; font-size:22px; color:rgba(255,255,255,.8); }
        .netlesson-page #tab03 .topik-pc-row .v small { font-size:12px; font-family:'Noto Sans JP',sans-serif; color:rgba(255,255,255,.4); }
        .netlesson-page #tab03 .topik-pc-total { display:flex; justify-content:space-between; align-items:baseline; padding-top:16px; border-top:1px solid rgba(200,145,30,.25); }
        .netlesson-page #tab03 .topik-pc-total .tl { font-size:11px; color:rgba(255,255,255,.35); }
        .netlesson-page #tab03 .topik-pc-total .tv { font-family:'Cormorant Garamond',serif; font-size:40px; color:var(--topik-gold-lt); }
        .netlesson-page #tab03 .topik-pc-right { padding:40px; display:flex; flex-direction:column; justify-content:center; gap:16px; background:rgba(255,255,255,.03); }
        .netlesson-page #tab03 .topik-pc-right-title { font-family:'Noto Serif JP',serif; font-size:16px; color:rgba(255,255,255,.85); margin-bottom:4px; font-weight:600; }
        .netlesson-page #tab03 .topik-pc-note { font-size:12.5px; color:rgba(255,255,255,.65); line-height:1.9; background:rgba(200,145,30,.1); border:1px solid rgba(200,145,30,.22); border-radius:12px; padding:16px 18px; }
        .netlesson-page #tab03 .topik-deadline-pill { display:inline-flex; align-items:center; gap:6px; background:rgba(200,145,30,.12); border:1px solid rgba(200,145,30,.3); color:var(--topik-gold-lt); font-size:12px; border-radius:100px; padding:7px 16px; }
        .netlesson-page #tab03 .topik-pc-cta { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,var(--topik-gold),var(--topik-gold-lt)); color:var(--topik-navy); font-family:'Noto Serif JP',serif; font-size:15px; font-weight:700; padding:15px 32px; border-radius:100px; text-decoration:none; letter-spacing:.04em; transition:all .25s; box-shadow:0 4px 20px rgba(200,145,30,.4); text-align:center; justify-content:center; }
        .netlesson-page #tab03 .topik-pc-cta:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(200,145,30,.55); }
        .netlesson-page #tab03 .topik-cta-section { background:linear-gradient(150deg,#2a1e06 0%,#1a1200 50%,#0e1c38 100%); padding:88px 48px; text-align:center; position:relative; overflow:hidden; }
        .netlesson-page #tab03 .topik-cta-section::before { content:'作文'; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-family:'Noto Serif JP',serif; font-size:260px; font-weight:600; color:rgba(200,145,30,.05); pointer-events:none; }
        .netlesson-page #tab03 .topik-cta-section::after { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 60% 70% at 50% 0%,rgba(232,184,75,.12) 0%,transparent 55%); pointer-events:none; }
        .netlesson-page #tab03 .topik-cta-inner { position:relative; z-index:1; }
        .netlesson-page #tab03 .topik-cta-inner h2 { font-family:'Noto Serif JP',serif; font-size:clamp(24px,3.8vw,46px); color:#fff; margin-bottom:12px; line-height:1.3; font-weight:400; }
        .netlesson-page #tab03 .topik-cta-inner h2 em { color:var(--topik-gold-lt); font-style:italic; }
        .netlesson-page #tab03 .topik-cta-inner p { font-size:14px; color:rgba(255,255,255,.4); margin-bottom:36px; line-height:1.9; }
        .netlesson-page #tab03 .topik-cta-apply { display:inline-flex; align-items:center; gap:10px; background:linear-gradient(135deg,var(--topik-gold),var(--topik-gold-lt)); color:var(--topik-navy); font-family:'Noto Serif JP',serif; font-size:16px; font-weight:700; padding:18px 52px; border-radius:100px; text-decoration:none; letter-spacing:.05em; transition:all .25s; box-shadow:0 4px 28px rgba(200,145,30,.4); }
        .netlesson-page #tab03 .topik-cta-apply:hover { transform:translateY(-3px); box-shadow:0 10px 40px rgba(200,145,30,.6); }
        .netlesson-page #tab03 .topik-test-section { background:var(--topik-cream-dk); }
        .netlesson-page #tab03 .topik-year-group { margin-bottom:40px; }
        .netlesson-page #tab03 .topik-year-group:last-child { margin-bottom:0; }
        .netlesson-page #tab03 .topik-year-label { display:flex; align-items:center; gap:16px; margin-bottom:18px; }
        .netlesson-page #tab03 .topik-year-label .topik-yr { font-family:'Cormorant Garamond',serif; font-size:22px; color:var(--topik-navy); }
        .netlesson-page #tab03 .topik-year-label::after { content:''; flex:1; height:1px; background:var(--topik-border); }
        .netlesson-page #tab03 .topik-test-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .netlesson-page #tab03 .topik-test-card { background:#fff; border:1px solid var(--topik-border); border-left:3px solid rgba(192,57,43,.3); border-radius:16px; padding:28px; position:relative; overflow:hidden; transition:transform .25s,box-shadow .25s; }
        .netlesson-page #tab03 .topik-test-card:hover { transform:translateY(-3px); box-shadow:0 10px 32px rgba(14,28,56,.08); }
        .netlesson-page #tab03 .topik-test-card::before { content:'\\201C'; position:absolute; top:12px; left:20px; font-family:'Cormorant Garamond',serif; font-size:64px; color:var(--topik-red); opacity:.1; line-height:1; }
        .netlesson-page #tab03 .topik-test-card-full { grid-column:1/-1; }
        .netlesson-page #tab03 .topik-test-card-kr { background:linear-gradient(135deg,rgba(253,241,240,.6),#fff); }
        .netlesson-page #tab03 .topik-test-head { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .netlesson-page #tab03 .topik-test-av { width:38px; height:38px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,var(--topik-red),var(--topik-red-lt)); color:#fff; font-size:14px; display:flex; align-items:center; justify-content:center; font-weight:600; }
        .netlesson-page #tab03 .topik-test-name { font-size:13px; font-weight:500; color:var(--topik-text); }
        .netlesson-page #tab03 .topik-test-from { font-size:11px; color:var(--topik-muted); margin-top:1px; }
        .netlesson-page #tab03 .topik-test-badge { margin-left:auto; background:var(--topik-red-pale); border:1px solid rgba(192,57,43,.2); color:var(--topik-red); font-size:10px; font-weight:700; padding:3px 10px; border-radius:100px; }
        .netlesson-page #tab03 .topik-test-body { font-size:13px; color:var(--topik-text-mid); line-height:1.9; }
        .netlesson-page #tab03 .topik-test-body-kr { font-size:12.5px; line-height:2; }
        .netlesson-page #tab03 .topik-test-date { display:none; }
        .netlesson-page #tab03 .topik-year-label .topik-yr { display:none; }
        @media (max-width:900px) { .netlesson-page #tab03 .topik-hero-top { grid-template-columns:1fr; } .netlesson-page #tab03 .topik-steps-grid { grid-template-columns:1fr 1fr; } .netlesson-page #tab03 .topik-steps-row2 { grid-template-columns:1fr; } .netlesson-page #tab03 .topik-price-card { grid-template-columns:1fr; } .netlesson-page #tab03 .topik-test-grid { grid-template-columns:1fr; } }
        @media (max-width:600px) { .netlesson-page #tab03 .topik-hero { padding:48px 24px 0; margin:0 0 24px 0; } .netlesson-page #tab03 .topik-section { padding:48px 24px; } .netlesson-page #tab03 .topik-steps-grid { grid-template-columns:1fr; } .netlesson-page #tab03 .topik-features-3 { grid-template-columns:1fr !important; } }
      `}</style>

      <NetlessonNav />

      <div className="hero">
        <p className="hero-eyebrow">ONLINE COURSE</p>
        <h1>通信講座</h1>
        <p>メール作文・音読トレーニング・TOPIKトレーニング など、ご自宅から受講できるオンライン講座のご案内です。</p>
      </div>

      <NetlessonClient
        writingUrl={IFRAME_URLS.writing}
        ondokuUrl={IFRAME_URLS.ondoku}
        topikUrl={IFRAME_URLS.topik}
        footer={
          <footer>
            <div className="footer-inner">
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
                <a href="/voice">『ミリネ教科書』音声</a>
                <a href="/cancel">キャンセル規定</a>
              </div>
              </div>
              <div className="footer-bottom">
                Copyright © 2010-{new Date().getFullYear()} 株式会社 カオンヌリ All Rights Reserved.
              </div>
            </div>
          </footer>
        }
      >
        <NetlessonSidebar />
      </NetlessonClient>
    </div>
  );
}
