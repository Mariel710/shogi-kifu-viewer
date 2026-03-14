# CLAUDE.md

## 言語
- ユーザーとのやり取りは全て日本語で行うこと
- 確認メッセージ、質問、進捗報告、エラー説明はすべて日本語
- コード中のコメントは英語でOK
- コミットメッセージは英語でOK

## プロジェクト概要
将棋の棋譜並べアプリ。KIF/KI2/CSA/SFEN形式の棋譜を読み込み、1手ずつ再生できる。
iOS / Android / Web の3プラットフォーム対応。

## 技術スタック
- Expo SDK 54+（React Native）/ expo-router / TypeScript
- NativeWind v4（Tailwind CSS for React Native）
- json-kifu-format（棋譜パーサー）/ shogi.js（将棋ロジック）
- expo-sqlite（ローカル保存）
- EAS Build / EAS Submit（ビルド・配信）

## コーディング規約
- コンポーネントは関数コンポーネント + Hooks
- 状態管理は React 標準（useState, useReducer, useContext）
- スタイリングは NativeWind のユーティリティクラスを使用
- プラットフォーム分岐は `Platform.select` または `.native.tsx` / `.web.tsx` ファイル分割
- テスト: Jest + React Native Testing Library

## コマンド
- `npx expo start` - 開発サーバー起動
- `npx expo start --web` - Web版で起動
- `npx expo export:web` - Web版ビルド
- `eas build --platform ios` - iOS用ビルド
- `eas build --platform android` - Android用ビルド
- `eas submit --platform ios` - App Store申請
- `eas submit --platform android` - Google Play申請
- `npm run lint` - ESLint実行
- `npm run test` - テスト実行
- `npm run typecheck` - 型チェック

## 開発フェーズ
- Phase 1: ✅ プロジェクト初期設定（現在）
- Phase 2: 将棋盤の表示
- Phase 3: 棋譜パーサーと再生エンジン
- Phase 4: 再生コントロールUI
- Phase 5: 棋譜リストと分岐表示
- Phase 6: 棋譜読み込みUI
- Phase 7: コメント表示・対局情報
- Phase 8: 盤面反転
- Phase 9: 棋譜ローカル保存
- Phase 10: URL共有とディープリンク
- Phase 11: ストア公開準備
- Phase 12: テストとCI

## 注意事項
- json-kifu-format はブラウザ向けライブラリなので、React Native環境での動作を必ずテスト
- Shift_JIS の文字コード変換が必要な場合は iconv-lite を使用
- 将棋の駒は漢字テキストで表示（画像は使用しない）
- スマホファースト設計: モバイルレイアウトを先に実装
- 盤面描画は View + Text で行い、Canvas は使用しない（クロスプラットフォーム互換性のため）
- 分岐手順は JKF の forks フィールドを利用
- ジェスチャー操作は react-native-gesture-handler を使用
- 触覚フィードバックは expo-haptics を使用
- NativeWind v4 は react-native-reanimated v3 と組み合わせること（v4 は非対応）

## セキュリティ規約
- ユーザー入力は必ずサニタイズしてから使用（特にSQLiteクエリ・URL）
- `eval()` および `dangerouslySetInnerHTML` は使用禁止
- SQLiteクエリはプリペアドステートメントを使用（例: `db.runAsync('... WHERE id = ?', [id])`）
- APIキーやシークレットをコードにハードコードしない（環境変数または EAS Secrets を使用）
- 外部URLへのfetchはホワイトリスト方式（許可ドメインを定数として管理）
- 実装完了時は必ず `npm run lint` と `npx tsc --noEmit` を実行してからコミット
