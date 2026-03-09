import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { CurriculumRow } from "../../curriculum/route";
import type { CurriculumTheme } from "../../curriculum/route";

// フロント（kojin.html）の短期集中カリキュラム・テーマをそのままDBに反映するデータ

const THEMES: CurriculumTheme[] = [
  { slug: "phon", name: "発音", color: "#2d7a6e", bgColor: "#e8f5f3" },
  { slug: "vocab", name: "語彙", color: "#b06a00", bgColor: "#fff3e0" },
  { slug: "bunpou", name: "文法", color: "#b06a00", bgColor: "#fff3e0" },
  { slug: "single", name: "単語", color: "#b06a00", bgColor: "#fff3e0" },
  { slug: "expr", name: "表現", color: "#b06a00", bgColor: "#fff3e0" },
  { slug: "conv", name: "抑揚", color: "#3d6b8a", bgColor: "#e8f0f8" },
  { slug: "listen", name: "聴解", color: "#6b4a8a", bgColor: "#f3e8f5" },
  { slug: "ondoku", name: "音読", color: "#6b4a8a", bgColor: "#f3e8f5" },
  { slug: "kaiwa", name: "会話", color: "#3d6b8a", bgColor: "#e8f0f8" },
  { slug: "write", name: "作文", color: "#7a6a00", bgColor: "#fef9e0" },
  { slug: "summary", name: "総まとめ", color: "#b06a00", bgColor: "#fff3e0" },
  { slug: "end", name: "修了", color: "#b8924a", bgColor: "#f7f0e3" },
];

// 初級：フロントの12/24/48コマ表から抽出（テーマ・内容・色は現行表示と一致）
const SHOKYU_ROWS: CurriculumRow[] = [
  { koma: "1", c12: "発音のルール1・2　発音矯正集中トレーニング1", c24: "発音のルール1・2　発音矯正集中トレーニング1・2", c48: "発音のルール1　発音のルール2　発音矯正集中トレーニング1・2・3", theme12: "phon", theme24: "phon", theme48: "phon" },
  { koma: "2–3", c12: "—", c24: "—", c48: "", theme12: "", theme24: "", theme48: "" },
  { koma: "4", c12: "하요/합니다体 連体形 変則のまとめ　初級 時制・助詞のまとめ", c24: "12コマと同内容に加え、追加演習", c48: "", theme12: "bunpou", theme24: "vocab", theme48: "" },
  { koma: "5", c12: "ネイティブ抑揚トレーニング1・2・3", c24: "", c48: "", theme12: "conv", theme24: "", theme48: "" },
  { koma: "6", c12: "ネイティブ抑揚トレーニング1・2・3・4", c24: "", c48: "", theme12: "conv", theme24: "", theme48: "" },
  { koma: "7", c12: "韓国語耳になる速聴トレーニング1", c24: "", c48: "", theme12: "listen", theme24: "", theme48: "" },
  { koma: "8", c12: "必須初級単語（全体25%構成）1・2・3", c24: "", c48: "", theme12: "single", theme24: "", theme48: "" },
  { koma: "9", c12: "韓国語耳になる速聴トレーニング1", c24: "", c48: "", theme12: "listen", theme24: "", theme48: "" },
  { koma: "10", c12: "数字・日付〜이/가서 vs〜고　初級〜이/가서 総まとめ　初級理由表現の総まとめ", c24: "音読トレーニング1　音読トレーニング2", c48: "", theme12: "bunpou", theme24: "ondoku", theme48: "" },
  { koma: "11", c12: "会話トレーニング1・2", c24: "会話トレーニング1・2", c48: "", theme12: "kaiwa", theme24: "kaiwa", theme48: "" },
  { koma: "12", c12: "初級総まとめ（文法・語彙・表現・比較・願望・要求・依頼・提案ほか）", c24: "初級총まとめ・追加文法・表現パターン", c48: "", theme12: "summary", theme24: "vocab", theme48: "" },
  { koma: "13", c12: "12コマ修了", c24: "", c48: "", theme12: "end", theme24: "", theme48: "" },
  { koma: "17", c12: "", c24: "必須初級単語（全体50%構成）1・2・3・4", c48: "", theme12: "", theme24: "single", theme48: "" },
  { koma: "18–20", c12: "", c24: "—", c48: "", theme12: "", theme24: "", theme48: "" },
  { koma: "21–24", c12: "", c24: "会話トレーニング1・2・3・4", c48: "", theme12: "", theme24: "kaiwa", theme48: "" },
  { koma: "25", c12: "", c24: "24コマコース修了", c48: "", theme12: "", theme24: "end", theme48: "" },
  { koma: "2–26", c12: "", c24: "", c48: "初級全範囲（発音・文法・語彙・抑揚・聴解・会話）", theme12: "", theme24: "", theme48: "vocab" },
  { koma: "27–33", c12: "", c24: "", c48: "必須初級単語（100%構成）1・2・3・4・5・6・7", theme12: "", theme24: "", theme48: "single" },
  { koma: "34–37", c12: "", c24: "", c48: "初級必須表現1・2・3・4", theme12: "", theme24: "", theme48: "expr" },
  { koma: "38–40", c12: "", c24: "", c48: "TOPIKⅡ作文対策1・2・3", theme12: "", theme24: "", theme48: "write" },
  { koma: "41–48", c12: "", c24: "", c48: "会話トレーニング1・2・3・4・5・6・7・8", theme12: "", theme24: "", theme48: "kaiwa" },
  { koma: "49", c12: "", c24: "", c48: "48コマコース修了", theme12: "", theme24: "", theme48: "end" },
];

// 中級：フロントの12/24/48コマ表から抽出
const CHUKYU_ROWS: CurriculumRow[] = [
  { koma: "1", c12: "発音のルール1・2　発音矯正集中トレーニング1", c24: "発音のルール1・2　発音矯正集中トレーニング1・2", c48: "発音のルール1・2　発音矯正集中トレーニング1・2・3", theme12: "phon", theme24: "phon", theme48: "phon" },
  { koma: "2–3", c12: "—", c24: "", c48: "", theme12: "", theme24: "", theme48: "" },
  { koma: "4", c12: "推量と予想表現　文語体と丁寧体　中級理由総まとめ　初中級間接話法", c24: "中級文法・表現の網羅的演習", c48: "", theme12: "bunpou", theme24: "vocab", theme48: "" },
  { koma: "5", c12: "ネイティブ抑揚トレーニング1・2・3", c24: "", c48: "", theme12: "conv", theme24: "", theme48: "" },
  { koma: "6", c12: "ネイティブ抑揚トレーニング1・2・3・4", c24: "", c48: "", theme12: "conv", theme24: "", theme48: "" },
  { koma: "7", c12: "韓国語耳になる速聴トレーニング1", c24: "", c48: "", theme12: "listen", theme24: "", theme48: "" },
  { koma: "8", c12: "必須中級単語（全体25%構成）1・2・3", c24: "", c48: "", theme12: "single", theme24: "", theme48: "" },
  { koma: "9", c12: "韓国語耳になる速聴トレーニング1", c24: "", c48: "", theme12: "listen", theme24: "", theme48: "" },
  { koma: "10", c12: "推量・予想表現　文語体・丁寧体　中級理由表現の総まとめ　初中級間接話法", c24: "", c48: "", theme12: "bunpou", theme24: "", theme48: "" },
  { koma: "11", c12: "会話トレーニング1・2", c24: "", c48: "", theme12: "kaiwa", theme24: "", theme48: "" },
  { koma: "12", c12: "音読トレーニング2　中級総まとめ", c24: "", c48: "", theme12: "ondoku", theme24: "", theme48: "" },
  { koma: "13", c12: "12コマ修了", c24: "", c48: "", theme12: "end", theme24: "", theme48: "" },
  { koma: "17", c12: "", c24: "必須中級単語（全体50%構成）1・2・3・4", c48: "", theme12: "", theme24: "single", theme48: "" },
  { koma: "18–20", c12: "", c24: "—", c48: "", theme12: "", theme24: "", theme48: "" },
  { koma: "21–24", c12: "", c24: "会話トレーニング1・2・3・4", c48: "", theme12: "", theme24: "kaiwa", theme48: "" },
  { koma: "25", c12: "", c24: "24コマコース修了", c48: "", theme12: "", theme24: "end", theme48: "" },
  { koma: "2–26", c12: "", c24: "", c48: "中級全範囲（文法・語彙・表現・抑揚・聴解・会話）", theme12: "", theme24: "", theme48: "vocab" },
  { koma: "27–33", c12: "", c24: "", c48: "必須中級単語（100%構成）1・2・3・4・5・6・7", theme12: "", theme24: "", theme48: "single" },
  { koma: "34–37", c12: "", c24: "", c48: "中級必須表現1・2・3・4", theme12: "", theme24: "", theme48: "expr" },
  { koma: "38–40", c12: "", c24: "", c48: "TOPIK5級目標　作文対策1・2・3", theme12: "", theme24: "", theme48: "write" },
  { koma: "41–48", c12: "", c24: "", c48: "会話トレーニング1・2・3・4・5・6・7・8", theme12: "", theme24: "", theme48: "kaiwa" },
  { koma: "49", c12: "", c24: "", c48: "48コマコース修了", theme12: "", theme24: "", theme48: "end" },
];

// 上級：フロントの12/24/48コマ表から抽出
const JOKYU_ROWS: CurriculumRow[] = [
  { koma: "1", c12: "発音のルール1・2　発音矯正集中トレーニング1", c24: "発音のルール1・2　発音矯正集中トレーニング1・2・3", c48: "発音のルール1・2　発音矯正集中トレーニング1・2・3", theme12: "phon", theme24: "phon", theme48: "phon" },
  { koma: "2–3", c12: "—", c24: "", c48: "", theme12: "", theme24: "", theme48: "" },
  { koma: "4", c12: "上級変化表現・上級引用文法・上級否定表現・上級状況表現・上級推量表現", c24: "上級文法・表現の網羅的演習　ネイティブ表現強化", c48: "", theme12: "bunpou", theme24: "vocab", theme48: "" },
  { koma: "5", c12: "ネイティブ抑揚トレーニング1・2・3", c24: "", c48: "", theme12: "conv", theme24: "", theme48: "" },
  { koma: "6", c12: "ネイティブ抑揚トレーニング1・2・3・4", c24: "", c48: "", theme12: "conv", theme24: "", theme48: "" },
  { koma: "7", c12: "韓国語耳になる速聴トレーニング1", c24: "", c48: "", theme12: "listen", theme24: "", theme48: "" },
  { koma: "8", c12: "必須上級単語（全体25%構成）1・2・3", c24: "", c48: "", theme12: "single", theme24: "", theme48: "" },
  { koma: "9", c12: "韓国語耳になる速聴トレーニング1", c24: "", c48: "", theme12: "listen", theme24: "", theme48: "" },
  { koma: "10", c12: "上級変化表現・状況・推量まとめ　上級条件表現　ネイティブが使う韓国語表現1", c24: "", c48: "", theme12: "bunpou", theme24: "", theme48: "" },
  { koma: "11", c12: "会話トレーニング1　会話トレーニング2", c24: "", c48: "", theme12: "kaiwa", theme24: "", theme48: "" },
  { koma: "12", c12: "上級全文法・ネイティブ表現・状況・慣習・態度　上級総まとめ", c24: "", c48: "", theme12: "summary", theme24: "", theme48: "" },
  { koma: "13", c12: "12コマ修了", c24: "", c48: "", theme12: "end", theme24: "", theme48: "" },
  { koma: "17", c12: "", c24: "必須上級単語（全体50%構成）1・2・3・4", c48: "", theme12: "", theme24: "single", theme48: "" },
  { koma: "18–20", c12: "", c24: "—", c48: "", theme12: "", theme24: "", theme48: "" },
  { koma: "21", c12: "", c24: "会話トレーニング1", c48: "", theme12: "", theme24: "kaiwa", theme48: "" },
  { koma: "22–24", c12: "", c24: "—", c48: "", theme12: "", theme24: "", theme48: "" },
  { koma: "25", c12: "", c24: "24コマコース修了", c48: "", theme12: "", theme24: "end", theme48: "" },
  { koma: "2–26", c12: "", c24: "", c48: "上級全範囲（文法・語彙・ネイティブ表現・抑揚・聴解・会話）", theme12: "", theme24: "", theme48: "vocab" },
  { koma: "27–33", c12: "", c24: "", c48: "必須上級単語（100%構成）1・2・3・4・5・6・7", theme12: "", theme24: "", theme48: "single" },
  { koma: "34–37", c12: "", c24: "", c48: "ネイティブのようになる　上級必須表現1・2・3・4", theme12: "", theme24: "", theme48: "expr" },
  { koma: "38–40", c12: "", c24: "", c48: "TOPIK5・6級を目指す作文対策1・2・3", theme12: "", theme24: "", theme48: "write" },
  { koma: "41–48", c12: "", c24: "", c48: "会話トレーニング1・2・3・4・5・6・7・8", theme12: "", theme24: "", theme48: "kaiwa" },
  { koma: "49", c12: "", c24: "", c48: "48コマコース修了", theme12: "", theme24: "", theme48: "end" },
];

const CURRICULUM_BLOCKS = [
  { blockKey: "curriculum_shokyu", title: "初級", rows: SHOKYU_ROWS },
  { blockKey: "curriculum_chukyu", title: "中級", rows: CHUKYU_ROWS },
  { blockKey: "curriculum_jokyu", title: "上級", rows: JOKYU_ROWS },
];

// 短期集中講座 日程・料金（曜日・時間・内容・料金）
type TankiRow = { yobi: string; jikan: string; naiyo: string; ryokin: string };
const TANKI_SHOKYU: TankiRow[] = [
  { yobi: "平日午前", jikan: "10:00-12:00", naiyo: "ひらがな・カタカナ、発音、文法、基本会話", ryokin: "38,500円/回" },
  { yobi: "平日午後", jikan: "13:00-15:00", naiyo: "ひらがな・カタカナ、発音、文法、基本会話", ryokin: "38,500円/回" },
  { yobi: "平日夜間", jikan: "19:00-21:00", naiyo: "ひらがな・カタカナ、発音、文法、基本会話", ryokin: "44,000円/回" },
  { yobi: "土日祝", jikan: "10:00-12:00", naiyo: "ひらがな・カタカナ、発音、文法、基本会話", ryokin: "44,000円/回" },
  { yobi: "土日祝", jikan: "13:00-15:00", naiyo: "ひらがな・カタカナ、発音、文法、基本会話", ryokin: "44,000円/回" },
];
const TANKI_CHUKYU: TankiRow[] = [
  { yobi: "平日午前", jikan: "10:00-12:00", naiyo: "日本語能力試験N4・N3・N2レベル文法、語彙、読解、聴解、会話練習", ryokin: "38,500円/回" },
  { yobi: "平日午後", jikan: "13:00-15:00", naiyo: "日本語能力試験N4・N3・N2レベル文法、語彙、読解、聴解、会話練習", ryokin: "38,500円/回" },
  { yobi: "平日夜間", jikan: "19:00-21:00", naiyo: "日本語能力試験N4・N3・N2レベル文法、語彙、読解、聴解、会話練習", ryokin: "44,000円/回" },
  { yobi: "土日祝", jikan: "10:00-12:00", naiyo: "日本語能力試験N4・N3・N2レベル文法、語彙、読解、聴解、会話練習", ryokin: "44,000円/回" },
  { yobi: "土日祝", jikan: "13:00-15:00", naiyo: "日本語能力試験N4・N3・N2レベル文法、語彙、読解、聴解、会話練習", ryokin: "44,000円/回" },
];
const TANKI_JOKYU: TankiRow[] = [
  { yobi: "平日午前", jikan: "10:00-12:00", naiyo: "日本語能力試験N1レベル文法、語彙、読解、聴解、会話練習、小論文、ビジネス日本語", ryokin: "38,500円/回" },
  { yobi: "平日午後", jikan: "13:00-15:00", naiyo: "日本語能力試験N1レベル文法、語彙、読解、聴解、会話練習、小論文、ビジネス日本語", ryokin: "38,500円/回" },
  { yobi: "平日夜間", jikan: "19:00-21:00", naiyo: "日本語能力試験N1レベル文法、語彙、読解、聴解、会話練習、小論文、ビジネス日本語", ryokin: "44,000円/回" },
  { yobi: "土日祝", jikan: "10:00-12:00", naiyo: "日本語能力試験N1レベル文法、語彙、読解、聴解、会話練習、小論文、ビジネス日本語", ryokin: "44,000円/回" },
  { yobi: "土日祝", jikan: "13:00-15:00", naiyo: "日本語能力試験N1レベル文法、語彙、読解、聴解、会話練習、小論文、ビジネス日本語", ryokin: "44,000円/回" },
];
const TANKI_BLOCKS = [
  { blockKey: "tanki_shokyu", title: "初級", rows: TANKI_SHOKYU },
  { blockKey: "tanki_chukyu", title: "中級", rows: TANKI_CHUKYU },
  { blockKey: "tanki_jokyu", title: "上級", rows: TANKI_JOKYU },
];

const THEMES_BLOCK_KEY = "curriculum_themes";
const PAGE_SLUG = "kojin";

export async function POST() {
  // テーマ（タグの色・表示名）をDBに保存
  await prisma.siteTable.upsert({
    where: { pageSlug_blockKey: { pageSlug: PAGE_SLUG, blockKey: THEMES_BLOCK_KEY } },
    create: { pageSlug: PAGE_SLUG, blockKey: THEMES_BLOCK_KEY, title: "テーマ", rowsJson: JSON.stringify(THEMES) },
    update: { rowsJson: JSON.stringify(THEMES) },
  });

  for (const { blockKey, title, rows } of CURRICULUM_BLOCKS) {
    await prisma.siteTable.upsert({
      where: { pageSlug_blockKey: { pageSlug: PAGE_SLUG, blockKey } },
      create: { pageSlug: PAGE_SLUG, blockKey, title, rowsJson: JSON.stringify(rows) },
      update: { title, rowsJson: JSON.stringify(rows) },
    });
  }
  for (const { blockKey, title, rows } of TANKI_BLOCKS) {
    await prisma.siteTable.upsert({
      where: { pageSlug_blockKey: { pageSlug: PAGE_SLUG, blockKey } },
      create: { pageSlug: PAGE_SLUG, blockKey, title, rowsJson: JSON.stringify(rows) },
      update: { title, rowsJson: JSON.stringify(rows) },
    });
  }
  return NextResponse.json({
    ok: true,
    message: "短期集中カリキュラム（初級・中級・上級）とテーマの色・内容をフロントと同期して登録しました。",
  });
}
