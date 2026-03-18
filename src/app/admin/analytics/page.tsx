"use client";

import { useState, useEffect } from "react";

type AnalyticsData = {
  referrers: { domain: string; referrer: string | null; count: number; avgDuration: number | null; latestAt: string | null }[];
  sourceTypes: { type: string; count: number; avgDuration: number | null }[];
  sourceMedias: { media: string; count: number; avgDuration: number | null }[];
  countries: { country: string; count: number; avgDuration: number | null }[];
  regions: { region: string; count: number; avgDuration: number | null }[];
  pagePaths: { path: string; count: number; avgDuration: number | null }[];
  totalSessions: number;
  avgDuration: number | null;
};

function formatDuration(sec: number | null): string {
  if (sec == null) return "-";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}分${s}秒` : `${s}秒`;
}

function sourceTypeLabel(type: string): string {
  const map: Record<string, string> = {
    search: "検索",
    sns: "SNS",
    direct: "直接",
    referral: "その他",
  };
  return map[type] ?? type;
}

function formatCountWithPercent(count: number, total: number): string {
  if (total === 0) return `${count}`;
  const pct = Math.round((count / total) * 100);
  return `${count} (${pct}%)`;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  const fetchData = () => {
    setLoading(true);
    setApiError(null);
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/admin/login/";
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d && d.error) {
          setApiError(d.error);
          setData(null);
          return;
        }
        if (d) setData(d);
      })
      .catch((e) => {
        setApiError(e instanceof Error ? e.message : "読み込みに失敗しました");
        setData(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [days]);

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>アクセス解析</h1>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
        mirinae.jp ホームページへのアクセス元と滞在時間を分析します。
      </p>

      <div style={{ marginBottom: 24, padding: 16, background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>流入元の把握方法</h3>
        <table style={{ width: "100%", fontSize: 13 }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "8px 12px", width: 140, fontWeight: 500 }}>Referrer（リファラー）</td>
              <td style={{ padding: "8px 12px", color: "#666" }}>他サイトのリンクから遷移した場合、ブラウザが送る Referer ヘッダーで参照元を確認できます。</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "8px 12px", fontWeight: 500 }}>UTMパラメータ</td>
              <td style={{ padding: "8px 12px", color: "#666" }}>リンクに ?utm_source=google などを付けると、その値で参照元を追跡できます。</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 12px", fontWeight: 500 }}>分析ツール</td>
              <td style={{ padding: "8px 12px", color: "#666" }}>Google Analytics、Vercel Analytics などで流入経路・チャネルを表示します。</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <label style={{ fontSize: 14 }}>期間:</label>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value, 10))}
          style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "8px 12px", fontSize: 14 }}
        >
          <option value={7}>過去7日</option>
          <option value={30}>過去30日</option>
          <option value={90}>過去90日</option>
        </select>
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            padding: "8px 16px",
            fontSize: 14,
            background: "#e5e7eb",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          更新
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#666" }}>読み込み中...</p>
      ) : data ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div style={{ padding: 16, background: "#eff6ff", borderRadius: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1e40af", marginBottom: 4 }}>セッション数</h3>
              <p style={{ fontSize: 28, fontWeight: 700, color: "#2563eb" }}>{data.totalSessions}</p>
            </div>
            <div style={{ padding: 16, background: "#f0fdf4", borderRadius: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#166534", marginBottom: 4 }}>平均滞在時間</h3>
              <p style={{ fontSize: 28, fontWeight: 700, color: "#16a34a" }}>{formatDuration(data.avgDuration)}</p>
            </div>
          </div>

          {data.pagePaths.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>ページ別アクセス</h3>
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px" }}>ページ</th>
                    <th style={{ textAlign: "right", padding: "10px 12px" }}>アクセス数</th>
                    <th style={{ textAlign: "right", padding: "10px 12px" }}>平均滞在</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const total = data.pagePaths.reduce((s, x) => s + x.count, 0);
                    return data.pagePaths.map((p) => (
                      <tr key={p.path} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "10px 12px" }}>{p.path || "/"}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatCountWithPercent(p.count, total)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatDuration(p.avgDuration)}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          )}

          {data.sourceTypes.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>流入元タイプ</h3>
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px" }}>タイプ</th>
                    <th style={{ textAlign: "right", padding: "10px 12px" }}>アクセス数</th>
                    <th style={{ textAlign: "right", padding: "10px 12px" }}>平均滞在</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const total = data.sourceTypes.reduce((sum, x) => sum + x.count, 0);
                    return data.sourceTypes.map((s) => (
                      <tr key={s.type} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "10px 12px" }}>{sourceTypeLabel(s.type)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatCountWithPercent(s.count, total)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatDuration(s.avgDuration)}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          )}

          {data.sourceMedias.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>SNSメディア別</h3>
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px" }}>メディア</th>
                    <th style={{ textAlign: "right", padding: "10px 12px" }}>アクセス数</th>
                    <th style={{ textAlign: "right", padding: "10px 12px" }}>平均滞在</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const total = data.sourceMedias.reduce((sum, x) => sum + x.count, 0);
                    return data.sourceMedias.map((s) => (
                      <tr key={s.media} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "10px 12px" }}>{s.media}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatCountWithPercent(s.count, total)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatDuration(s.avgDuration)}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          )}

          {data.countries.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>国・地域別</h3>
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px" }}>国・地域</th>
                    <th style={{ textAlign: "right", padding: "10px 12px" }}>アクセス数</th>
                    <th style={{ textAlign: "right", padding: "10px 12px" }}>平均滞在</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const total = data.countries.reduce((sum, x) => sum + x.count, 0);
                    return data.countries.map((c) => (
                      <tr key={c.country} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "10px 12px" }}>{c.country}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatCountWithPercent(c.count, total)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatDuration(c.avgDuration)}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          )}

          {data.regions.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>地域詳細</h3>
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px" }}>地域</th>
                    <th style={{ textAlign: "right", padding: "10px 12px" }}>アクセス数</th>
                    <th style={{ textAlign: "right", padding: "10px 12px" }}>平均滞在</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const total = data.regions.reduce((sum, x) => sum + x.count, 0);
                    return data.regions.map((r) => (
                      <tr key={r.region} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "10px 12px" }}>{r.region}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatCountWithPercent(r.count, total)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatDuration(r.avgDuration)}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>アクセス元（参照元）</h3>
            {data.referrers.length === 0 ? (
              <p style={{ color: "#666" }}>データがありません。</p>
            ) : (
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px" }}>参照元</th>
                    <th style={{ textAlign: "left", padding: "10px 12px" }}>リファラー</th>
                    <th style={{ textAlign: "right", padding: "10px 12px" }}>アクセス数</th>
                    <th style={{ textAlign: "right", padding: "10px 12px" }}>平均滞在</th>
                    <th style={{ textAlign: "left", padding: "10px 12px" }}>最新アクセス</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const total = data.referrers.reduce((sum, x) => sum + x.count, 0);
                    return data.referrers.map((r) => (
                      <tr key={r.domain} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "10px 12px" }}>{r.domain}</td>
                        <td style={{ padding: "10px 12px", color: "#666", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }} title={r.referrer || undefined}>
                          {r.referrer ? (
                            <a href={r.referrer} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>
                              {r.referrer}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatCountWithPercent(r.count, total)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatDuration(r.avgDuration)}</td>
                        <td style={{ padding: "10px 12px", color: "#666" }}>{r.latestAt ? new Date(r.latestAt).toLocaleString("ja-JP") : "-"}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p style={{ color: "#666" }}>データを読み込んでください。Supabase の設定を確認してください。</p>
          {apiError && (
            <p style={{ color: "#c00", marginTop: 12, fontSize: 13 }}>エラー: {apiError}</p>
          )}
        </div>
      )}
    </div>
  );
}
