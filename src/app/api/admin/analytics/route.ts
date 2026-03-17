import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function checkAuth(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get("mirinae_admin")?.value;
  return token === "1";
}

export async function GET(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      referrers: [],
      totalSessions: 0,
      sourceTypes: [],
      sourceMedias: [],
      countries: [],
      regions: [],
      pagePaths: [],
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const days = parseInt(request.nextUrl.searchParams.get("days") || "30", 10);
    const since = new Date();
    since.setDate(since.getDate() - Math.min(Math.max(days, 1), 365));

    const dateCol = "created_at";
    let { data: rows, error } = await supabase
      .from("homepage_analytics")
      .select("referrer_domain, referrer, source_type, source_media, country, region, page_path, duration_seconds, created_at")
      .gte("created_at", since.toISOString());

    if (error) {
      const fallback = await supabase
        .from("homepage_analytics")
        .select("referrer_domain, referrer, source_type, source_media, country, region, page_path, duration_seconds, started_at")
        .gte("started_at", since.toISOString());
      if (!fallback.error) {
        rows = fallback.data;
        error = null;
      }
    }

    if (error) {
      console.error("[admin/analytics]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = rows || [];

    const refAgg: Record<string, { count: number; domain: string; totalDuration: number; withDuration: number; latestAt: string | null; latestReferrer: string | null }> = {};
    for (const r of list) {
      const domain = r.referrer_domain || "(直接)";
      if (!refAgg[domain]) refAgg[domain] = { count: 0, domain, totalDuration: 0, withDuration: 0, latestAt: null, latestReferrer: null };
      refAgg[domain].count++;
      if (r.duration_seconds != null) {
        refAgg[domain].totalDuration += r.duration_seconds;
        refAgg[domain].withDuration++;
      }
      const at = r.created_at ?? (r as { started_at?: string }).started_at;
      if (at) {
        if (!refAgg[domain].latestAt || at > refAgg[domain].latestAt!) {
          refAgg[domain].latestAt = at;
          refAgg[domain].latestReferrer = r.referrer && r.referrer.startsWith("http") ? r.referrer : null;
        }
      }
    }
    const referrers = Object.values(refAgg).map((a) => ({
      domain: a.domain,
      referrer: a.latestReferrer,
      count: a.count,
      avgDuration: a.withDuration > 0 ? Math.round(a.totalDuration / a.withDuration) : null,
      latestAt: a.latestAt,
    })).sort((a, b) => (b.latestAt || "").localeCompare(a.latestAt || ""));

    const sourceTypeAgg: Record<string, { count: number; totalDuration: number; withDuration: number }> = {};
    for (const r of list) {
      const st = r.source_type || "direct";
      if (!sourceTypeAgg[st]) sourceTypeAgg[st] = { count: 0, totalDuration: 0, withDuration: 0 };
      sourceTypeAgg[st].count++;
      if (r.duration_seconds != null) {
        sourceTypeAgg[st].totalDuration += r.duration_seconds;
        sourceTypeAgg[st].withDuration++;
      }
    }
    const sourceTypes = Object.entries(sourceTypeAgg).map(([type, a]) => ({
      type,
      count: a.count,
      avgDuration: a.withDuration > 0 ? Math.round(a.totalDuration / a.withDuration) : null,
    })).sort((a, b) => b.count - a.count);

    const sourceMediaAgg: Record<string, { count: number; totalDuration: number; withDuration: number }> = {};
    for (const r of list) {
      const sm = r.source_media || null;
      if (sm) {
        if (!sourceMediaAgg[sm]) sourceMediaAgg[sm] = { count: 0, totalDuration: 0, withDuration: 0 };
        sourceMediaAgg[sm].count++;
        if (r.duration_seconds != null) {
          sourceMediaAgg[sm].totalDuration += r.duration_seconds;
          sourceMediaAgg[sm].withDuration++;
        }
      }
    }
    const sourceMedias = Object.entries(sourceMediaAgg).map(([media, a]) => ({
      media,
      count: a.count,
      avgDuration: a.withDuration > 0 ? Math.round(a.totalDuration / a.withDuration) : null,
    })).sort((a, b) => b.count - a.count);

    const countryAgg: Record<string, { count: number; totalDuration: number; withDuration: number }> = {};
    for (const r of list) {
      const c = r.country || "(不明)";
      if (!countryAgg[c]) countryAgg[c] = { count: 0, totalDuration: 0, withDuration: 0 };
      countryAgg[c].count++;
      if (r.duration_seconds != null) {
        countryAgg[c].totalDuration += r.duration_seconds;
        countryAgg[c].withDuration++;
      }
    }
    const countries = Object.entries(countryAgg).map(([country, a]) => ({
      country,
      count: a.count,
      avgDuration: a.withDuration > 0 ? Math.round(a.totalDuration / a.withDuration) : null,
    })).sort((a, b) => b.count - a.count);

    const regionAgg: Record<string, { count: number; totalDuration: number; withDuration: number }> = {};
    for (const r of list) {
      const c = r.country || "不明";
      const reg = r.region || "";
      const key = reg ? `${c} / ${reg}` : c;
      if (!regionAgg[key]) regionAgg[key] = { count: 0, totalDuration: 0, withDuration: 0 };
      regionAgg[key].count++;
      if (r.duration_seconds != null) {
        regionAgg[key].totalDuration += r.duration_seconds;
        regionAgg[key].withDuration++;
      }
    }
    const regions = Object.entries(regionAgg).map(([region, a]) => ({
      region,
      count: a.count,
      avgDuration: a.withDuration > 0 ? Math.round(a.totalDuration / a.withDuration) : null,
    })).sort((a, b) => b.count - a.count);

    const pagePathAgg: Record<string, { count: number; totalDuration: number; withDuration: number }> = {};
    for (const r of list) {
      const p = r.page_path || "/";
      if (!pagePathAgg[p]) pagePathAgg[p] = { count: 0, totalDuration: 0, withDuration: 0 };
      pagePathAgg[p].count++;
      if (r.duration_seconds != null) {
        pagePathAgg[p].totalDuration += r.duration_seconds;
        pagePathAgg[p].withDuration++;
      }
    }
    const pagePaths = Object.entries(pagePathAgg).map(([path, a]) => ({
      path,
      count: a.count,
      avgDuration: a.withDuration > 0 ? Math.round(a.totalDuration / a.withDuration) : null,
    })).sort((a, b) => b.count - a.count);

    const withDuration = list.filter((r) => r.duration_seconds != null);
    const avgDuration = withDuration.length > 0
      ? Math.round(withDuration.reduce((s, r) => s + (r.duration_seconds ?? 0), 0) / withDuration.length)
      : null;

    return NextResponse.json({
      referrers,
      sourceTypes,
      sourceMedias,
      countries,
      regions,
      pagePaths,
      totalSessions: list.length,
      avgDuration,
    });
  } catch (e) {
    console.error("[admin/analytics]", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
