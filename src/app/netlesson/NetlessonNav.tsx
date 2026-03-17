"use client";

import { useState, useEffect } from "react";

export default function NetlessonNav() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <style>{`
        .netlesson-nav {
          background: var(--white);
          border-bottom: 1px solid var(--gray-border);
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 32px;
          height: 56px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .netlesson-nav a { text-decoration: none; color: var(--mid); font-size: 13px; letter-spacing: 0.05em; transition: color .2s; }
        .netlesson-nav a:hover { color: var(--gold); }
        .netlesson-nav .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          color: var(--dark);
          letter-spacing: 0.1em;
          margin-right: auto;
          white-space: nowrap;
        }
        .netlesson-nav .nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 44px;
          height: 44px;
          padding: 10px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 101;
        }
        .netlesson-nav .nav-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--dark);
          transition: transform .25s, opacity .25s;
        }
        .netlesson-nav.nav-open .nav-hamburger span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .netlesson-nav.nav-open .nav-hamburger span:nth-child(2) { opacity: 0; }
        .netlesson-nav.nav-open .nav-hamburger span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .netlesson-nav .nav-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 99;
          opacity: 0;
          transition: opacity .3s;
          pointer-events: none;
        }
        .netlesson-nav .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .netlesson-nav .nav-links a {
          display: block;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 500;
          color: var(--mid);
          text-decoration: none;
          border-radius: 6px;
          transition: background .15s, color .15s;
          white-space: nowrap;
        }
        .netlesson-nav .nav-links a:hover { background: var(--gold-pale); color: var(--gold); }
        .netlesson-nav .nav-cta { background: var(--gold) !important; color: white !important; border-radius: 6px !important; font-weight: 700 !important; padding: 8px 16px !important; }
        .netlesson-nav .nav-cta:hover { background: var(--gold-light) !important; color: white !important; }
        .netlesson-nav .nav-links .nav-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 180px;
          background: var(--white);
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          padding: 8px 0;
          list-style: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity .2s, visibility .15s;
          z-index: 9999;
          border: 1px solid var(--gray-border);
          pointer-events: none;
        }
        .netlesson-nav .nav-links > li { position: relative; }
        .netlesson-nav .nav-links > li:hover .nav-dropdown { opacity: 1; visibility: visible; pointer-events: auto; }
        .netlesson-nav .nav-dropdown a { padding: 10px 20px; font-size: 13px; border-radius: 0; }
        @media (max-width: 900px) {
          .netlesson-nav { padding: 0 16px; }
          .netlesson-nav .nav-overlay { display: block; }
          .netlesson-nav.nav-open .nav-overlay { opacity: 1; pointer-events: auto; }
          .netlesson-nav .nav-hamburger { display: flex; margin-left: auto; }
          .netlesson-nav .nav-links {
            position: fixed;
            top: 0; right: 0;
            width: min(320px, 85vw);
            height: 100vh;
            background: var(--white);
            flex-direction: column;
            align-items: stretch;
            padding: 72px 24px 24px;
            box-shadow: -4px 0 24px rgba(0,0,0,0.12);
            overflow-y: auto;
            transform: translateX(100%);
            transition: transform .3s ease;
            z-index: 100;
          }
          .netlesson-nav.nav-open .nav-links { transform: translateX(0); }
          .netlesson-nav .nav-links > li { border-bottom: 1px solid var(--gray-border); }
          .netlesson-nav .nav-links > li.has-dropdown .nav-dropdown {
            position: static;
            opacity: 1;
            visibility: visible;
            box-shadow: none;
            border: none;
            padding: 0 0 0 16px;
            margin-top: 4px;
            display: none;
            pointer-events: auto;
          }
          .netlesson-nav .nav-links > li.has-dropdown.open .nav-dropdown { display: block; }
          .netlesson-nav .nav-links a { padding: 14px 0; }
          .netlesson-nav .nav-logo { font-size: 14px; margin-right: 0; }
        }
        @media (max-width: 600px) {
          .netlesson-nav .nav-logo { font-size: 13px; }
        }
      `}</style>
      <nav className={`netlesson-nav ${open ? "nav-open" : ""}`}>
        <a href="/" className="nav-logo">ミリネ韓国語教室</a>
        <button
          type="button"
          className="nav-hamburger"
          aria-label="メニューを開く"
          onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        >
          <span /><span /><span />
        </button>
        <div className="nav-overlay" aria-hidden="true" onClick={() => { setOpen(false); setDropdownOpen(false); }} />
        <ul className="nav-links">
          <li><a href="/" onClick={() => setOpen(false)}>ホーム</a></li>
          <li className={`has-dropdown ${dropdownOpen ? "open" : ""}`}>
            <a
              href="/#recruiting"
              onClick={(e) => {
                if (typeof window !== "undefined" && window.innerWidth <= 900) {
                  e.preventDefault();
                  setDropdownOpen(!dropdownOpen);
                } else {
                  setOpen(false);
                }
              }}
            >
              講座
            </a>
            <ul className="nav-dropdown">
              <li><a href="/kojin" onClick={() => setOpen(false)}>個人レッスン</a></li>
              <li><a href="/group" onClick={() => setOpen(false)}>グループレッスン</a></li>
              <li><a href="/kaiwa" onClick={() => setOpen(false)}>会話強化クラス</a></li>
              <li><a href="/special" onClick={() => setOpen(false)}>試験対策講座</a></li>
              <li><a href="/syutyu" onClick={() => setOpen(false)}>集中講座</a></li>
              <li><a href="/netlesson" onClick={() => setOpen(false)}>通信講座</a></li>
            </ul>
          </li>
          <li><a href="/about" onClick={() => setOpen(false)}>会社概要</a></li>
          <li><a href="/about#tab02" onClick={() => setOpen(false)}>アクセス</a></li>
          <li><a href="/trial" className="nav-cta" onClick={() => setOpen(false)}>お申込み</a></li>
          <li><a href="/about#tab03" onClick={() => setOpen(false)}>講師</a></li>
          <li><a href="/book" onClick={() => setOpen(false)}>著書</a></li>
          <li><a href="/trial#tab04" onClick={() => setOpen(false)}>お問い合わせ</a></li>
        </ul>
      </nav>
    </>
  );
}
