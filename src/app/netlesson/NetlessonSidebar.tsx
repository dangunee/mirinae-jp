"use client";

import { useState, useEffect } from "react";

export default function NetlessonSidebar() {
  const [activeTab, setActiveTab] = useState("tab01");

  useEffect(() => {
    const sync = () => {
      const h = (typeof window !== "undefined" ? window.location.hash : "").replace("#", "");
      if (["tab01", "tab02", "tab03"].includes(h)) setActiveTab(h);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    const titles = document.querySelectorAll(".netlesson-page .courses-nav .nav-group-title");
    const handlers: { el: Element; fn: (e: Event) => void }[] = [];
    titles.forEach((btn) => {
      const handler = (e: Event) => {
        if (e.type === "keydown" && (e as KeyboardEvent).key !== "Enter" && (e as KeyboardEvent).key !== " ") return;
        if (e.type === "keydown") (e as KeyboardEvent).preventDefault();
        const group = btn.closest(".nav-group");
        if (group) group.classList.toggle("open");
      };
      btn.addEventListener("click", handler);
      btn.addEventListener("keydown", handler);
      handlers.push({ el: btn, fn: handler });
    });
    return () =>
      handlers.forEach(({ el, fn }) => {
        el.removeEventListener("click", fn);
        el.removeEventListener("keydown", fn);
      });
  }, []);

  return (
    <aside className="sidebar">
      <a
        href="/group#tab05"
        className="sidebar-promo-card"
        style={{ backgroundImage: "url('/img/student/writing.jpg')" }}
        aria-label="土曜上級対面講座"
      />
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
              <div className="nav-items-inner">
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
              <div className="nav-items-inner">
                <a href="/group#tab01" className="nav-item">入門＆初級講座</a>
                <a href="/group#tab02" className="nav-item">中級文法講座</a>
                <a href="/group#tab03" className="nav-item">上級文法講座</a>
                <a href="/group#tab04" className="nav-item">上級1土曜講座</a>
                <a href="/group#tab05" className="nav-item">上級2土曜講座</a>
              </div>
            </div>
          </div>
          <div className="nav-divider" />
          <div className="nav-group">
            <div className="nav-group-title" role="button" tabIndex={0}>
              会話強化クラス<span className="nav-chevron">▾</span>
            </div>
            <div className="nav-items">
              <div className="nav-items-inner">
                <a href="/kaiwa#tab01" className="nav-item">会話クラス</a>
                <a href="/kaiwa#tab02" className="nav-item">音読クラス</a>
                <a href="/kaiwa#tab03" className="nav-item">発音・抑揚</a>
                <a href="/kaiwa#tab04" className="nav-item">小説朗読</a>
                <a href="/kaiwa#tab07" className="nav-item">語彙力強化</a>
              </div>
            </div>
          </div>
          <div className="nav-divider" />
          <div className="nav-group">
            <div className="nav-group-title" role="button" tabIndex={0}>
              試験対策講座<span className="nav-chevron">▾</span>
            </div>
            <div className="nav-items">
              <div className="nav-items-inner">
                <a href="/special#tab01" className="nav-item">TOPIK初級</a>
                <a href="/special#tab02" className="nav-item">TOPIK中級</a>
                <a href="/special#tab03" className="nav-item">TOPIK上級</a>
                <a href="/special#tab04" className="nav-item">ハン検1/2級</a>
                <a href="/special#tab05" className="nav-item">ハン検準2級</a>
              </div>
            </div>
          </div>
          <div className="nav-divider" />
          <div className="nav-group">
            <div className="nav-group-title" role="button" tabIndex={0}>
              集中講座<span className="nav-chevron">▾</span>
            </div>
            <div className="nav-items">
              <div className="nav-items-inner">
                <a href="/syutyu#tab01" className="nav-item">入門講座</a>
                <a href="/syutyu#tab02" className="nav-item">初級講座</a>
                <a href="/syutyu#tab03" className="nav-item">中級講座</a>
                <a href="/syutyu#tab04" className="nav-item">上級講座</a>
              </div>
            </div>
          </div>
          <div className="nav-divider" />
          <div className="nav-group open">
            <div className="nav-group-title" role="button" tabIndex={0}>
              通信講座<span className="nav-chevron">▾</span>
            </div>
            <div className="nav-items" style={{ gridTemplateRows: "1fr" }}>
              <div className="nav-items-inner">
                <a href="/netlesson#tab01" className={`nav-item ${activeTab === "tab01" ? "active" : ""}`}>
                  作文トレーニング
                </a>
                <a href="/netlesson#tab02" className={`nav-item ${activeTab === "tab02" ? "active" : ""}`}>
                  音読トレーニング
                </a>
                <a href="/netlesson#tab03" className={`nav-item ${activeTab === "tab03" ? "active" : ""}`}>
                  TOPIKトレーニング
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
