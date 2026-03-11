import NetlessonClient from "./NetlessonClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "通信講座｜ミリネ韓国語教室",
  description:
    "メール作文・音読トレーニング・TOPIK作文トレーニング など、ご自宅から受講できるオンライン講座のご案内です。",
};

const EXTERNAL_URLS = {
  writing: "https://writing.mirinae.jp/?embed=1",
  ondoku: "https://ondoku.mirinae.jp/?embed=1",
  topik: "https://writing.mirinae.jp/?tab=topik&embed=1",
} as const;

export default function NetlessonPage() {

  return (
    <div className="netlesson-page">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap"
      />
      <style>{`
        .netlesson-page { --beige:#f5f0e8; --taupe:#BD9962; --gold:#B8963E; --gold-light:#e8d5b0; --gold-pale:#f7f0e3; --dark:#1C1C1E; --white:#FFF; --gray-border:#E5E0D8; --text-dark:#2c2c2c; --text-muted:#8E8E93; --mid:#4a4438; }
        .netlesson-page * { margin:0; padding:0; box-sizing:border-box; }
        .netlesson-page { font-family:'Noto Sans JP',sans-serif; color:var(--text-dark); line-height:1.8; background:#FAFAF7; }
        .netlesson-page .page-wrapper { max-width:1200px; margin:0 auto; min-height:100vh; }
        .netlesson-page .top-bar { background:var(--white); padding:12px 24px; font-size:12px; color:var(--text-muted); display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:16px; border-bottom:1px solid var(--gray-border); }
        .netlesson-page .top-bar a { color:var(--dark); text-decoration:none; font-weight:500; font-size:14px; }
        .netlesson-page .top-bar a:hover { color:var(--gold); }
        .netlesson-page .main-content { padding:0 24px 80px; }
        .netlesson-page .page-header { padding:40px 0 24px; }
        .netlesson-page .page-title { font-family:'Noto Serif JP',serif; font-size:clamp(28px,5vw,40px); font-weight:700; letter-spacing:0.04em; color:var(--dark); margin-bottom:12px; }
        .netlesson-page .page-subtitle { color:var(--text-muted); font-size:14px; font-weight:300; }
        .netlesson-page .tab-bar { display:grid; grid-template-columns:repeat(3,1fr); border-bottom:2px solid var(--gray-border); }
        .netlesson-page .tab-btn { background:none; border:none; padding:14px 8px; font-size:13px; font-weight:500; color:var(--text-muted); cursor:pointer; position:relative; }
        .netlesson-page .tab-btn::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:2px; background:var(--gold); transform:scaleX(0); transition:transform .25s; }
        .netlesson-page .tab-btn.active { color:var(--gold); font-weight:700; }
        .netlesson-page .tab-btn.active::after { transform:scaleX(1); }
        .netlesson-page .tab-panel { padding-top:32px; }
        .netlesson-page .section-header { background:var(--taupe); color:white; padding:16px 24px; font-size:18px; font-weight:600; border-radius:8px 8px 0 0; margin-bottom:0; }
        .netlesson-page .iframe-card { border-radius:0 0 8px 8px; border:1px solid var(--gray-border); border-top:none; background:var(--white); box-shadow:0 8px 24px rgba(0,0,0,.06); padding:18px 20px 24px; }
        .netlesson-page .form-note { font-size:13px; color:var(--text-muted); margin-bottom:16px; }
        .netlesson-page .group-main-grid { display:grid; grid-template-columns:1fr 300px; gap:32px; align-items:start; }
        .netlesson-page .group-left { min-width:0; }
        .netlesson-page .sidebar { position:sticky; top:80px; padding-top:200px; }
        .netlesson-page .courses-nav-box { background:var(--white); border:1px solid var(--gray-border); border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.06); }
        .netlesson-page .courses-nav-header { background:var(--dark); padding:20px 18px; color:var(--white); }
        .netlesson-page .courses-nav-label { font-size:10px; letter-spacing:.2em; color:var(--gold-light); margin-bottom:4px; }
        .netlesson-page .courses-nav-title { font-family:'Noto Serif JP',serif; font-size:18px; font-weight:600; }
        .netlesson-page .nav-group-title { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; color:var(--mid); font-size:12px; font-weight:500; cursor:pointer; }
        .netlesson-page .nav-group-title:hover { background:var(--gold-pale); color:var(--gold); }
        .netlesson-page .nav-group.open .nav-group-title { color:var(--gold); }
        .netlesson-page .nav-chevron { width:16px; height:16px; border-radius:50%; border:1px solid var(--gray-border); font-size:7px; }
        .netlesson-page .nav-items { display:grid; grid-template-rows:0fr; transition:grid-template-rows .28s; overflow:hidden; }
        .netlesson-page .nav-group.open .nav-items { grid-template-rows:1fr; }
        .netlesson-page .nav-item { padding:8px 14px 8px 18px; font-size:12px; color:var(--mid); text-decoration:none; display:block; }
        .netlesson-page .nav-item:hover, .netlesson-page .nav-item.active { color:var(--gold); font-weight:500; }
        .netlesson-page .nav-divider { height:1px; background:var(--gray-border); margin:0; }
        .netlesson-page footer { background:#2c2c2c; color:white; padding:48px 24px 24px; }
        .netlesson-page .footer-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:32px; max-width:1200px; margin:0 auto 40px; }
        .netlesson-page .footer-column h4 { font-size:14px; margin-bottom:16px; }
        .netlesson-page .footer-column a { display:block; color:rgba(255,255,255,.8); text-decoration:none; font-size:14px; margin-bottom:8px; }
        .netlesson-page .footer-column a:hover { color:white; }
        .netlesson-page .footer-bottom { text-align:center; padding-top:24px; border-top:1px solid rgba(255,255,255,.1); font-size:13px; }
        @media (max-width:900px) { .netlesson-page .group-main-grid { grid-template-columns:1fr; } .netlesson-page .sidebar { display:none; } }
        @media (max-width:560px) { .netlesson-page .tab-bar { grid-template-columns:1fr 1fr; } }
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

        <main className="main-content">
          <div className="group-main-grid">
            <div className="group-left">
              <div className="page-header">
                <h1 className="page-title">通信講座</h1>
                <p className="page-subtitle">
                  メール作文・音読トレーニング・TOPIK Training
                  など、ご自宅から受講できるオンライン講座のご案内です。
                </p>
              </div>

              <NetlessonClient
                writingUrl={EXTERNAL_URLS.writing}
                ondokuUrl={EXTERNAL_URLS.ondoku}
                topikUrl={EXTERNAL_URLS.topik}
              />
            </div>

            <aside className="sidebar">
              <div className="course-nav-card courses-nav-box">
                <div className="courses-nav-header">
                  <div className="courses-nav-label">Courses</div>
                  <div className="courses-nav-title">講座</div>
                </div>
                <div className="courses-nav">
                  <div className="nav-group">
                    <div className="nav-group-title" role="button" tabIndex={0}>
                      個人レッスン<span className="nav-chevron">▾</span>
                    </div>
                    <div className="nav-items">
                      <div style={{ overflow: "hidden", background: "var(--gold-pale)", padding: "8px 0" }}>
                        <a href="/kojin#tab01" className="nav-item">個人レッスン</a>
                        <a href="/kojin#tab02" className="nav-item">短期集中個人</a>
                        <a href="/kojin#tab03" className="nav-item">発音矯正</a>
                        <a href="/kojin#tab04" className="nav-item">レベルテスト</a>
                      </div>
                    </div>
                  </div>
                  <div className="nav-divider" />
                  <div className="nav-group">
                    <div className="nav-group-title" role="button" tabIndex={0}>
                      グループレッスン<span className="nav-chevron">▾</span>
                    </div>
                    <div className="nav-items">
                      <div style={{ overflow: "hidden", background: "var(--gold-pale)", padding: "8px 0" }}>
                        <a href="/group#tab01" className="nav-item">入門＆初級講座</a>
                        <a href="/group#tab02" className="nav-item">中級文法講座</a>
                        <a href="/group#tab03" className="nav-item">上級文法講座</a>
                        <a href="/group#tab04" className="nav-item">中級月1講座</a>
                        <a href="/group#tab05" className="nav-item">上級1土曜講座</a>
                        <a href="/group#tab06" className="nav-item">上級2土曜講座</a>
                      </div>
                    </div>
                  </div>
                  <div className="nav-divider" />
                  <div className="nav-group open">
                    <div className="nav-group-title" role="button" tabIndex={0}>
                      通信講座<span className="nav-chevron">▾</span>
                    </div>
                    <div className="nav-items" style={{ gridTemplateRows: "1fr" }}>
                      <div style={{ overflow: "hidden", background: "var(--gold-pale)", padding: "8px 0" }}>
                        <a href="/netlesson#tab01" className="nav-item active">作文トレーニング</a>
                        <a href="/netlesson#tab02" className="nav-item">音読トレーニング</a>
                        <a href="/netlesson#tab03" className="nav-item">TOPIK Training</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>

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
      </div>
    </div>
  );
}
