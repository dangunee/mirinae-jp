"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

function topikTbScroll(sel: string) {
  const el = document.querySelector(sel);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function TopikEmbed() {
  const tabBarRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<string>("#topik-about");

  const setActive = useCallback((sel: string) => {
    tabBarRef.current?.querySelectorAll(".topik-tb-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-scroll") === sel);
    });
    activeRef.current = sel;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = (e.target as HTMLElement).id;
          if (id?.startsWith("topik-")) setActive(`#${id}`);
        });
      },
      { threshold: 0.2, rootMargin: "-80px 0px -60% 0px" }
    );
    ["topik-about", "topik-features", "topik-sample", "topik-apply", "topik-testimonials"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    );
    return () => observer.disconnect();
  }, [setActive]);

  const handleTbClick = (sel: string) => {
    topikTbScroll(sel);
    setActive(sel);
  };

  return (
    <div className="topik-embed">
      <section className="topik-hero">
        <div className="topik-hero-lines" />
        <div className="topik-hero-redline" />
        <div className="topik-hero-kr">작문트레이닝</div>
        <div className="topik-hero-inner">
          <div className="topik-breadcrumb">
            ホーム <span>›</span> 講座 <span>›</span> 通信講座 <span>›</span> TOPIK作文
          </div>
          <div className="topik-hero-top">
            <div className="topik-hero-left">
              <div className="topik-hero-eyebrow">TOPIK WRITING TRAINING · 通信添削</div>
              <div className="topik-hero-badge">📮 メール提出 → ネイティブ添削</div>
              <h2 className="topik-hero-title">
                メールで<em>TOPIK</em>
                <br />
                作文トレーニング
              </h2>
              <p className="topik-hero-catch">
                忙しくても続けられる週1回の通信コース。
                <br />
                作文600〜700字の壁を、反復添削で突破します。
                <br />
                ネイティブ講師による丁寧な解説つき。
              </p>
              <div className="topik-hero-chips">
                <div className="topik-chip">📮 オンライン通信</div>
                <div className="topik-chip">📅 随時募集中</div>
                <div className="topik-chip">📝 全6回コース</div>
                <div className="topik-chip">🎯 TOPIKⅡ 4級以上</div>
              </div>
              <div className="topik-hero-btns">
                <a href="#topik-apply" className="topik-btn-primary">
                  お申込みはこちら →
                </a>
                <a href="#topik-features" className="topik-btn-ghost">
                  コース内容を見る
                </a>
              </div>
            </div>
            <div className="topik-hero-right">
              <div className="topik-hero-price-card">
                <div className="topik-hpc-ey">TUITION / 授業料</div>
                <div className="topik-hpc-name">
                  メールでTOPIK作文
                  <br />
                  トレーニング（6回コース）
                </div>
                <div className="topik-hpc-row">
                  <span className="k">1回あたり</span>
                  <span className="v">4,480<small style={{ fontSize: 13 }}> 円</small></span>
                </div>
                <div className="topik-hpc-row">
                  <span className="k">回数</span>
                  <span className="v">6<small style={{ fontSize: 13 }}> 回</small></span>
                </div>
                <div className="topik-hpc-row">
                  <span className="k">授業料（税抜）</span>
                  <span className="v">26,880<small style={{ fontSize: 13 }}> 円</small></span>
                </div>
                <div className="topik-hpc-total">
                  <span className="tl">税込合計</span>
                  <span className="tv">29,568<small style={{ fontSize: 16 }}> 円</small></span>
                </div>
                <div className="topik-hpc-note">随時募集中 · オンライン · 週1回ペース</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="topik-tab-bar" ref={tabBarRef}>
        <div className="topik-tab-bar-inner">
          <button
            type="button"
            className="topik-tb-btn active"
            data-scroll="#topik-about"
            onClick={() => handleTbClick("#topik-about")}
          >
            講座について
          </button>
          <span className="topik-tb-sep">|</span>
          <button
            type="button"
            className="topik-tb-btn"
            data-scroll="#topik-features"
            onClick={() => handleTbClick("#topik-features")}
          >
            コース内容
          </button>
          <span className="topik-tb-sep">|</span>
          <button
            type="button"
            className="topik-tb-btn"
            data-scroll="#topik-sample"
            onClick={() => handleTbClick("#topik-sample")}
          >
            課題参考例
          </button>
          <span className="topik-tb-sep">|</span>
          <button
            type="button"
            className="topik-tb-btn"
            data-scroll="#topik-apply"
            onClick={() => handleTbClick("#topik-apply")}
          >
            授業料
          </button>
          <span className="topik-tb-sep">|</span>
          <button
            type="button"
            className="topik-tb-btn"
            data-scroll="#topik-testimonials"
            onClick={() => handleTbClick("#topik-testimonials")}
          >
            受講生の声
          </button>
        </div>
      </div>

      <section className="topik-section topik-about-section" id="topik-about">
        <div className="topik-section-inner">
          <div className="topik-sec-ey">ABOUT THIS COURSE</div>
          <h2 className="topik-sec-title">講座について</h2>
          <div className="topik-about-grid">
            <div className="topik-about-lead">
              <p>
                TOPIKでの合格を目指しているけど、忙しくてなかなか学校に通う時間が取れない方のために、オンラインTOPIK作文コースをご用意しました。
                <br />
                <br />
                普段、韓国語で日記をつけたりメモを書いたりする習慣がない方にとっては
                <strong>作文600〜700字というハードル</strong>は思いのほか高いと思います。きちんとした文章を書けるようになるためには
                <strong>正しい作文のルールを身に付けること</strong>が大事です。間違った部分への丁寧な解説が点数アップへとつながります。
              </p>
            </div>
            <div className="topik-detail-table">
              <div className="topik-dt-row">
                <div className="topik-dt-lbl">
                  <span className="topik-dt-lbl-icon">🎯</span>
                  <span className="topik-dt-lbl-text">対象</span>
                </div>
                <div className="topik-dt-val">TOPIKⅡの4級以上を目指している方</div>
              </div>
              <div className="topik-dt-row">
                <div className="topik-dt-lbl">
                  <span className="topik-dt-lbl-icon">🏆</span>
                  <span className="topik-dt-lbl-text">目標</span>
                </div>
                <div className="topik-dt-val">
                  作文と添削指導の繰り返しを通じて、TOPIK4級以上の合格を狙う。
                </div>
              </div>
              <div className="topik-dt-row">
                <div className="topik-dt-lbl">
                  <span className="topik-dt-lbl-icon">📋</span>
                  <span className="topik-dt-lbl-text">授業の流れ</span>
                </div>
                <div className="topik-dt-val">
                  毎週金曜日午後3時にメールで作文テーマと使用すべき文型を送信。テーマに沿った作文を作成し、
                  <strong>翌週月曜夜9時まで</strong>に
                  <a href="mailto:sakubun@kaonnuri.com">sakubun@kaonnuri.com</a> へ提出してください。
                  <div className="topik-flow-highlight">
                    📅 金曜15時に課題送信 → 月曜21時までに提出 → 添削＋模範文を返送
                  </div>
                </div>
              </div>
              <div className="topik-dt-row">
                <div className="topik-dt-lbl">
                  <span className="topik-dt-lbl-icon">📅</span>
                  <span className="topik-dt-lbl-text">日程</span>
                </div>
                <div className="topik-dt-val">毎週１回（随時募集中）</div>
              </div>
              <div className="topik-dt-row">
                <div className="topik-dt-lbl">
                  <span className="topik-dt-lbl-icon">💻</span>
                  <span className="topik-dt-lbl-text">教室</span>
                </div>
                <div className="topik-dt-val">オンライン（メール添削）</div>
              </div>
              <div className="topik-dt-row">
                <div className="topik-dt-lbl">
                  <span className="topik-dt-lbl-icon">📚</span>
                  <span className="topik-dt-lbl-text">テキスト</span>
                </div>
                <div className="topik-dt-val">ミリネ独自のテキスト（PDF）※事前にメールにてお送りします。</div>
              </div>
            </div>
            <div
              className="topik-features-3"
              style={{
                gridColumn: "1/-1",
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 16,
                marginTop: 4,
              }}
            >
              <div
                style={{
                  background: "var(--topik-cream)",
                  border: "1px solid var(--topik-border)",
                  borderRadius: 16,
                  padding: 24,
                  borderTop: "3px solid var(--topik-red)",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 10 }}>🔁</div>
                <div
                  style={{
                    fontFamily: "'Noto Serif JP',serif",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--topik-text)",
                    marginBottom: 6,
                  }}
                >
                  反復で慣れる
                </div>
                <p style={{ fontSize: 12.5, color: "var(--topik-text-mid)", lineHeight: 1.85 }}>
                  反復して課題提出することでTOPIK長文作文に慣れます。
                </p>
              </div>
              <div
                style={{
                  background: "var(--topik-cream)",
                  border: "1px solid var(--topik-border)",
                  borderRadius: 16,
                  padding: 24,
                  borderTop: "3px solid var(--topik-gold)",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 10 }}>📐</div>
                <div
                  style={{
                    fontFamily: "'Noto Serif JP',serif",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--topik-text)",
                    marginBottom: 6,
                  }}
                >
                  文法と構成を習得
                </div>
                <p style={{ fontSize: 12.5, color: "var(--topik-text-mid)", lineHeight: 1.85 }}>
                  TOPIK中級以上の合格に必要な文法と表現、構成に慣れます。
                </p>
              </div>
              <div
                style={{
                  background: "var(--topik-cream)",
                  border: "1px solid var(--topik-border)",
                  borderRadius: 16,
                  padding: 24,
                  borderTop: "3px solid var(--topik-navy-mid)",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 10 }}>✏️</div>
                <div
                  style={{
                    fontFamily: "'Noto Serif JP',serif",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--topik-text)",
                    marginBottom: 6,
                  }}
                >
                  ネイティブが添削
                </div>
                <p style={{ fontSize: 12.5, color: "var(--topik-text-mid)", lineHeight: 1.85 }}>
                  ネイティブ添削文を通してどこが問題なのか把握できます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="topik-section topik-features-section" id="topik-features">
        <div className="topik-section-inner">
          <div className="topik-sec-ey">COURSE CONTENT</div>
          <h2 className="topik-sec-title">コース内容</h2>
          <p className="topik-sec-desc">6回の添削を通じて、作文力を段階的に引き上げます。</p>
          <div className="topik-steps-grid">
            <div className="topik-step-card">
              <div className="topik-step-num">STEP 01</div>
              <div className="topik-step-icon">📝</div>
              <h3>作文の基礎と分かち書きルール</h3>
              <p>作文の必要事項と正しい分かち書きのルールを学びます。</p>
            </div>
            <div className="topik-step-card">
              <div className="topik-step-num">STEP 02</div>
              <div className="topik-step-icon">🔴</div>
              <h3>誤字と高級表現に修正</h3>
              <p>誤字・脱字を修正しながら、より高度な表現へアップグレードします。</p>
            </div>
            <div className="topik-step-card">
              <div className="topik-step-num">STEP 03</div>
              <div className="topik-step-icon">🎯</div>
              <h3>TOPIKのパターンに慣れる</h3>
              <p>試験頻出の問題パターンと構成法をしっかり身につけます。</p>
            </div>
            <div className="topik-step-card">
              <div className="topik-step-num">STEP 04</div>
              <div className="topik-step-icon">⚡</div>
              <h3>実践練習と添削指導</h3>
              <p>本番同様のテーマで作文し、ネイティブ講師が丁寧に添削します。</p>
            </div>
          </div>
          <div className="topik-steps-row2">
            <div className="topik-step-card">
              <div className="topik-step-num">STEP 05</div>
              <div className="topik-step-icon">🔍</div>
              <h3>ネイティブ版との比較</h3>
              <p>提出した課題をネイティブが書いた時の比較文を提供します。</p>
            </div>
            <div className="topik-step-card">
              <div className="topik-step-num">STEP 06</div>
              <div className="topik-step-icon">📊</div>
              <h3>苦手ポイントを分析</h3>
              <p>自分の苦手なところを分析し、重点的に克服します。</p>
            </div>
            <div className="topik-step-card">
              <div className="topik-step-num">STEP 07</div>
              <div className="topik-step-icon">🏆</div>
              <h3>模範答案の提供</h3>
              <p>各課題の模範答案を提供します。正しい作文の型を繰り返し確認できます。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="topik-section topik-sample-section" id="topik-sample">
        <div className="topik-section-inner">
          <div className="topik-sec-ey">SAMPLE TASK</div>
          <h2 className="topik-sec-title">課題参考例</h2>
          <p className="topik-sec-desc">
            このような課題が毎週金曜日に送られ、次週に添削と模範文が返送されます。
          </p>
          <div className="topik-sample-wrap">
            <div className="topik-sample-head">
              <span className="topik-sample-head-badge">WEEKLY TASK</span>
              <span className="topik-sample-head-title">毎週金曜日に送付される課題例</span>
            </div>
            <div className="topik-sample-note">※ 次のような課題を出して、次週に添削と模範文が送られます。</div>
            <div className="topik-sample-body">
              <div className="topik-sample-theme">
                <div className="topik-sample-theme-label">주제 / テーマ</div>
                <div className="topik-sample-theme-text">
                  IT산업의 발달은 그 편리함으로 새로운 인간관계를 형성하도록 발전하였습니다. 그 수단으로
                  자리잡은 SNS의 나아갈 방향과 역할은 무엇입니까? 단, 아래에 제시된 내용이 모두 포함되어야 합니다.
                </div>
              </div>
              <div className="topik-sample-qs">
                <div className="topik-sample-q">
                  <div className="topik-sq-num">1</div>
                  <div className="topik-sq-text">SNS발달이 우리 생활에 미친 영향은?</div>
                </div>
                <div className="topik-sample-q">
                  <div className="topik-sq-num">2</div>
                  <div className="topik-sq-text">SNS의 나아갈 방향과 역할은 무엇입니까?</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="topik-section topik-price-section" id="topik-apply">
        <div className="topik-section-inner">
          <div className="topik-sec-ey">TUITION</div>
          <h2 className="topik-sec-title">授業料</h2>
          <div className="topik-price-card">
            <div className="topik-pc-left">
              <div className="topik-pc-ey">TOPIK WRITING / 6回コース</div>
              <div className="topik-pc-name">
                メールでTOPIK作文
                <br />
                トレーニング
              </div>
              <div className="topik-pc-rows">
                <div className="topik-pc-row">
                  <span className="k">1回あたり</span>
                  <span className="v">4,480<small> 円</small></span>
                </div>
                <div className="topik-pc-row">
                  <span className="k">回数</span>
                  <span className="v">6<small> 回</small></span>
                </div>
                <div className="topik-pc-row">
                  <span className="k">授業料（税抜）</span>
                  <span className="v">26,880<small> 円</small></span>
                </div>
              </div>
              <div className="topik-pc-total">
                <span className="tl">税込合計</span>
                <span className="tv">29,568<small style={{ fontSize: 18 }}> 円</small></span>
              </div>
            </div>
            <div className="topik-pc-right">
              <div>
                <div className="topik-pc-right-title">お申込み・提出先</div>
                <div className="topik-pc-note">
                  添削課題の提出先：<strong>sakubun@kaonnuri.com</strong>
                  <br />
                  <br />
                  毎週金曜日 15:00 にテーマと文型をメール送信
                  <br />
                  翌月曜日 21:00 までに作文を提出
                  <br />
                  提出後、添削＋模範文をメールで返送します
                  <br />
                  <br />※ 随時募集中のため、いつでもお申込みいただけます
                </div>
              </div>
              <div className="topik-deadline-pill">📅 随時募集中</div>
              <Link href="/trial" className="topik-pc-cta">
                お申込みはこちら →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="topik-cta-section">
        <div className="topik-cta-inner">
          <h2>
            作文力で、<em>4級を突破する。</em>
          </h2>
          <p>
            週1回のメール添削で、着実にライティング力を磨きましょう。
            <br />
            随時募集中のため、今すぐお申込みいただけます。
          </p>
          <Link href="/trial" className="topik-cta-apply">
            お申込みはこちら →
          </Link>
        </div>
      </div>

      <section className="topik-section topik-test-section" id="topik-testimonials">
        <div className="topik-section-inner">
          <div className="topik-sec-ey">TESTIMONIALS</div>
          <h2 className="topik-sec-title">受講生の声</h2>
          <p className="topik-sec-desc" style={{ marginBottom: 40 }}>
            実際に受講された方からのご感想です。
          </p>
          <div className="topik-year-group">
            <div className="topik-test-grid">
              <div className="topik-test-card">
                <div className="topik-test-head">
                  <div className="topik-test-av">C</div>
                  <div>
                    <div className="topik-test-name">C様</div>
                  </div>
                  <div className="topik-test-badge">TOPIK作文</div>
                </div>
                <div className="topik-test-body">
                  TOPIK作文対策に参加してとても勉強になりました。作文がずっと苦手だったため後回ししてきましたが、一大決心で講座に参加しました。自分が苦手なところがわかり少しコツもつかめて600字もがんばれば書けるという自信がつきました。あきらめずにコツコツ作文を書いていこうと思います。ご指導ありがとうございました。
                </div>
              </div>
              <div className="topik-test-card">
                <div className="topik-test-head">
                  <div className="topik-test-av">N</div>
                  <div>
                    <div className="topik-test-name">N様</div>
                  </div>
                  <div className="topik-test-badge">TOPIK作文</div>
                </div>
                <div className="topik-test-body">
                  作文講座に今回初めて参加しました。韓国で文章を書く練習がなかったので最初は一行書くのに何分もかかってました。今回授業や宿題でたくさんの文章を書くことで、韓国語の文章を書く時に必要な基本を覚えることができました。たぶん一人でやるのは難しかったと思います。
                </div>
              </div>
              <div className="topik-test-card">
                <div className="topik-test-head">
                  <div className="topik-test-av">H</div>
                  <div>
                    <div className="topik-test-name">H様</div>
                  </div>
                  <div className="topik-test-badge">TOPIK作文</div>
                </div>
                <div className="topik-test-body">
                  5回を通して、これだけ文章を書いたのは初めてでした。必要にせまられ、教えていただけると、自分にも書けるのだと感心しました。この経験は必ず生かします！文章を書くということは中級以上くらいの学習者には韓国語の勉強にとてもいいと思いました。이경아 선생님의 授業はとても良かったです。また機会があったら受講します。감사합니다.
                </div>
              </div>
              <div className="topik-test-card topik-test-card-kr">
                <div className="topik-test-head">
                  <div className="topik-test-av">N</div>
                  <div>
                    <div className="topik-test-name">N様</div>
                  </div>
                  <div className="topik-test-badge">TOPIK作文</div>
                </div>
                <div className="topik-test-body topik-test-body-kr">
                  선생님들의 섬세한 첨삭, 틀린점에 대한 알기쉬운 설명과 틀리지 않기위해서의 주의점까지 대단히 감사하고 도움이되었습니다. 첨삭문 화일을 펼치면 빨강색밖에 보이지 않아 낙심의 연속이기도 했습니다만, 낙심하면서도 자신이 충분한 시간을 가지고 과제에 임하지 못했던 점을 반성하기도 했습니다. 앞으로도 잘 부탁드립니다.
                </div>
                <div className="topik-test-date">2013年1月</div>
              </div>
            </div>
          </div>
          <div className="topik-year-group">
            <div className="topik-year-label">
              <span className="topik-yr">2013年10月</span>
            </div>
            <div className="topik-test-grid">
              <div className="topik-test-card topik-test-card-full">
                <div className="topik-test-head">
                  <div className="topik-test-av">S</div>
                  <div>
                    <div className="topik-test-name">S様</div>
                    <div className="topik-test-from">フリーランス翻訳家</div>
                  </div>
                  <div className="topik-test-badge">韓訳＋和訳コース</div>
                </div>
                <div className="topik-test-body">
                  2011年8月から2013年8月まで丸2年かけて、韓訳＋和訳コースを期限内ぎりぎりで何とか修了することができました。2年間、ご指導ありがとうございました。フリーランス翻訳家として仕事をしたいという目標があったものの、具体的にどのような勉強をすればよいかわからず、貴社ホームページに書かれていた翻訳技術を学べるという言葉に引かれて受講を決めました。2012年3月頃から現在の居住国・韓国で日本語のフリーランス翻訳者を募集している翻訳会社に履歴書を送り始め、トライアルテストにも合格することができ、いくつかの翻訳会社から韓国語から日本語への翻訳や監修のお仕事をいただけるようになりました。
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
