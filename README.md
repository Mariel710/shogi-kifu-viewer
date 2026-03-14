# 棋譜ビューア (Shogi Kifu Viewer)

将棋の棋譜並べアプリ。KIF・KI2・CSA・SFEN 等の主要な棋譜形式を読み込み、スマホでもPCでも快適に1手ずつ再生できます。

## プラットフォーム
- iOS (App Store)
- Android (Google Play)
- Web (ブラウザ版)

## 開発環境のセットアップ

```bash
npm install
npx expo start
```

## 対応棋譜形式
- KIF (.kif / .kifu) — 柿木形式
- KI2 (.ki2) — 柿木簡易形式
- CSA (.csa) — コンピュータ将棋協会形式
- SFEN/USI — Universal Shogi Interface形式
- JKF (.json) — JSON棋譜フォーマット

## 技術スタック
- [Expo](https://expo.dev/) SDK 54+ (React Native)
- [expo-router](https://expo.github.io/router/) — ファイルベースルーティング
- [NativeWind](https://www.nativewind.dev/) v4 — Tailwind CSS for React Native
- [json-kifu-format](https://github.com/na2hiro/json-kifu-format) — 棋譜パーサー
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) — ローカル保存

## ビルド・デプロイ
```bash
# EAS Build
eas build --platform ios
eas build --platform android

# Web
npx expo export --platform web
```

## ライセンス
MIT
