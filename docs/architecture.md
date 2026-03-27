# QUEST BOARD AI — 技術アーキテクチャ設計書

作成日: 2026-03-27
ステータス: ドラフト v1.0

---

## 1. アーキテクチャ概要

### 全体構成図

```
┌─────────────────────────────────────────────────────┐
│                    クライアント                       │
│         Next.js (App Router) + React 19              │
│         Tailwind CSS + DotGothic16 / Zen Kaku        │
│              PWA対応（Service Worker）                │
└────────────┬───────────────────────────┬─────────────┘
             │ HTTPS                      │ WebSocket
             ▼                            ▼
┌────────────────────────┐  ┌──────────────────────────┐
│   Vercel (ホスティング)  │  │  Supabase Realtime       │
│   ・Next.js SSR/ISR     │  │  ・リアルタイム通知        │
│   ・API Routes          │  │  ・バッジ獲得通知          │
│   ・Edge Functions      │  └──────────────────────────┘
└────────────┬────────────┘
             │
     ┌───────┴────────┐
     ▼                ▼
┌──────────┐  ┌──────────────────┐
│ Supabase │  │ Claude API       │
│ ・Auth    │  │ (Haiku 4.5)      │
│ ・DB      │  │ ・タスク自動生成   │
│ ・Storage │  │ ・目標分解        │
└──────────┘  └──────────────────┘
```

### 設計思想

1. **サーバーレスファースト**: Vercel + Supabaseでインフラ運用コストを最小化
2. **段階的スケール**: Free→Pro→Teamと需要に応じて段階アップ
3. **API費用の最適化**: Prompt Caching + Haiku 4.5で1リクエスト0.3円以下を維持
4. **PWA対応**: ネイティブアプリ不要でスマホホーム画面に追加可能
5. **オフラインファースト**: タスクの閲覧・完了はオフラインでも動作（AI生成のみオンライン必須）

---

## 2. 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 15.x (App Router) | フレームワーク。SSR/ISR/API Routes |
| React | 19.x | UIライブラリ |
| TypeScript | 5.x | 型安全性 |
| Tailwind CSS | 4.x | スタイリング |
| Supabase | — | Auth + DB + Realtime |
| Claude API | Haiku 4.5 | AIタスク生成 |
| Zustand | — | クライアント状態管理 |
| Zod | — | 入力バリデーション |
| Stripe | — | サブスク決済 |

---

## 3. ディレクトリ構造

```
app/
├── page.tsx                    # ランディングページ
├── layout.tsx                  # 共通レイアウト + PWA設定
├── (auth)/
│   ├── login/page.tsx          # ログイン
│   └── callback/route.ts       # OAuth コールバック
├── (app)/                      # 認証済みユーザーのみ
│   ├── layout.tsx              # タブバー込みのレイアウト
│   ├── quests/page.tsx         # クエスト一覧
│   ├── shop/page.tsx           # ショップ
│   ├── history/page.tsx        # 履歴
│   ├── badges/page.tsx         # バッジ
│   ├── collection/page.tsx     # コレクション
│   ├── stats/page.tsx          # 進捗サマリー（Pro）
│   └── settings/page.tsx       # 設定・課金管理
├── api/
│   ├── ai/generate-tasks/route.ts
│   ├── quests/route.ts          # GET, POST
│   ├── quests/[id]/route.ts     # PATCH, DELETE
│   ├── quests/[id]/undo/route.ts
│   └── billing/...
lib/
├── supabase/
│   ├── client.ts               # ブラウザ用
│   ├── server.ts               # サーバー用
│   └── middleware.ts           # セッション更新
├── ai/
│   └── generate-tasks.ts       # Claude API呼び出し
└── quests/
    ├── parse-bulk.ts           # [初][中][上]プレフィックスパーサー
    └── xp.ts                   # XP/RP計算
types/
└── index.ts                    # 共通型定義
components/
├── common/TabBar.tsx
├── player/...
├── quests/...
└── ...
```

---

## 4. データベース設計

→ `docs/migrations/` 以下にSQLマイグレーションを配置予定。

主要テーブル:
- `profiles` - ユーザープロフィール（XP, Level, RP, Streak等）
- `quests` - 現在のクエスト一覧
- `quest_history` - 完了済みクエスト履歴
- `badges` - 獲得バッジ
- `gacha_collection` - ガチャコレクション
- `shop_history` - ショップ購入履歴
- `task_templates` - タスクテンプレート

---

## 5. セキュリティ

- 全テーブルにRow Level Security (RLS) を適用
- APIキーはサーバーサイド環境変数のみ（`ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`等）
- 入力バリデーションはZodで実施
- Stripe WebhookはSignature検証必須
- SQLインジェクション対策: Supabase SDK使用で自動対策

---

## 6. 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run lint     # ESLint実行
npm run typecheck # 型チェック（tsc --noEmit）
```

環境変数は `.env.example` を参照。
