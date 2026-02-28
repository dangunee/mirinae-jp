# www.mirinae.jp（ミリネ韓国語教室 本サイト + 管理）

**ひとつのアプリ**で本サイトと管理画面を提供します。別ドメイン（admin.mirinae.jp）は使いません。

- **/** ～ **/book** … 本サイト（public 内の HTML）
- **/admin** … 管理画面（表データの編集）。**www.mirinae.jp/admin** でアクセス

このプロジェクトを **www.mirinae.jp** として 배포하면、トップがホームページ、/admin が 퀴즈/표 管理ページになります。

## GitHub で使う（깃허브에서 사용）

### 1) 이미 git init / 첫 커밋이 있다면

GitHub で 새 리포지토리 만든 뒤 (예: `mirinae-jp`), 아래만 실행:

```bash
cd admin.mirinae.jp   # 또는 이 프로젝트 폴더
git remote add origin https://github.com/YOUR_USERNAME/mirinae-jp.git
git branch -M main
git push -u origin main
```

### 2) 아직 git을 안 썼다면

```bash
cd admin.mirinae.jp
git init
git add .
git commit -m "Initial: www.mirinae.jp + /admin"
```

이후 위 1)의 `git remote add` ~ `git push` 순서대로 실행.

- `.env` 는 `.gitignore` 에 있어서 push 되지 않습니다.
- 다른 PC에서 clone 한 경우: `cp .env.example .env` 후 `DATABASE_URL` 설정.

## クラウドに 배포（Vercel など）

**로컬이 아니라 인터넷에서 admin を使う場合**は Vercel などに 배포できます。その場合 **SQLite は使えません**（サーバーレスではファイルが残らないため）。**PostgreSQL** が必要です。

1. **DB を用意**
   - 퀴즈앱과 같은 PostgreSQL を使う、または
   - [Vercel Postgres](https://vercel.com/storage/postgres) / [Neon](https://neon.tech) / [Supabase](https://supabase.com) などで PostgreSQL を作成

2. **Prisma を PostgreSQL に**
   - `prisma/schema.prisma` の `provider` を `"postgresql"` に変更
   - `npx prisma db push` は 로컬에서 1회 실행（DB URL を 해당 Postgres に設定して）

3. **Vercel に 배포**
   - [Vercel](https://vercel.com) に 로그イン → Import Git Repository → このリポジトリを選択
   - **Environment Variables** に `DATABASE_URL` を追加（PostgreSQL の接続文字列）
   - Deploy

4. **도메인**
   - Vercel では `xxx.vercel.app` が付与されます。**www.mirinae.jp** を使う場合は Vercel の Project Settings → Domains でカスタムドメインを追加し、DNS で CNAME を設定します。

## 技術スタック

- **Next.js 14** (App Router) + React
- **Prisma** + SQLite（開発時） / PostgreSQL（퀴즈앱과 같은 DB を使う場合）

## セットアップ

```bash
cd admin.mirinae.jp
npm install
cp .env.example .env
```

`.env` の `DATABASE_URL` を編集します。

- **開発のみ**: そのままで OK（SQLite、`prisma/dev.db` が作成されます）
- **퀴즈앱과 같은 DB を使う**: 퀴즈앱 の接続文字列を設定  
  `DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"`  
  その場合、`prisma/schema.prisma` の `provider` を `"sqlite"` から `"postgresql"` に変更してください。

```bash
npx prisma db push
npm run dev
```

ブラウザで http://localhost:3000 が本サイト、**http://localhost:3000/admin** が管理画面です。管理画面で「個人レッスン」→「個人レッスン 初級・中級・上級の初期データを登録」でカリキュラム表をDBに投入し、表のセルを編集して「保存」で更新できます。

## API

- `GET /api/curriculum?page=kojin` — 指定ページの表ブロック一覧（JSON）
- `POST /api/curriculum` — ブロックの作成・更新（body: `{ pageSlug, blockKey, title?, rows }`）
- `POST /api/seed/kojin` — 個人レッスン 初級・中級・上級の初期データを登録

## 本番・퀴즈앱 DB 利用時

1. 퀴즈앱 の DB 接続情報を用意する
2. `prisma/schema.prisma` の `provider` を `"postgresql"` に変更
3. `.env` に `DATABASE_URL="postgresql://..."` を設定
4. `npx prisma db push` で `site_tables` テーブルを 퀴즈앱 のDBに作成（既存テーブルには影響しません）
5. 管理画面で編集した内容は同じDBに保存されます。본문 사이트(mirinae.jp / t/) でこのデータを参照する場合は、API を呼ぶか静的ビルド時にAPIから取得する形で連携できます。
