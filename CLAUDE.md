# CLAUDE.md

このリポジトリは **ColoredNoiseTimer** の開発用プロジェクトです。

## プロダクト概要

ColoredNoiseTimer は、色名ノイズをブラウザ内で生成・再生しながら、ポモドーロタイマーで集中できるシンプルなWebアプリです。

- UI言語: 日本語
- ノイズ名: 英語表記
- MVP: ホームページ1枚
- 認証: なし
- バックエンド: MVPでは不要
- データ保存: 原則なし。ただしユーザー設定は localStorage で保持してよい
- 広告: MVPでは非表示。将来追加予定としてコードだけ用意する

## 技術スタック

- Framework: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- Audio: Web Audio API
- Test: Playwright + Vitest + Testing Library
- Quality: ESLint + build
- Design: Figma MCP / Figma Claude Code plugin を使用

## 実装方針

- 実装前に必ず短い作業計画を提示する
- 1回の作業は小さく分割する
- 画面はとにかくシンプルにする
- スマホ対応を必須とする
- UI文言は日本語、ノイズ名は英語にする
- タイマー中はページタイトルを更新する
  - 例: `24:12 - Focus | ColoredNoiseTimer`
- 音声は Web Audio API でブラウザ内生成する
- MVPではバックエンドを追加しない
- localStorage は設定保存のみに限定する

## MVP機能

- 色名ノイズの選択
- ノイズ再生 / 停止
- 音量スライダー
- ポモドーロタイマー
- 集中 / 休憩の切り替え
- タイマー開始 / 停止
- タイマーリセット
- 集中時間・休憩時間の変更
- タイマー終了音ON/OFF
- 将来広告用の非表示コンポーネント

## MVPノイズ

- White Noise
- Grey Noise
- Pink Noise
- Brown Noise
- Blue Noise
- Violet Noise

## Git運用

- `main` への直接pushは禁止
- 作業は必ず `feature/*` ブランチで行う
- 原則として1機能1PR
- PR前に以下を実行する
  - `npm run lint`
  - `npm run test`
  - `npm run test:e2e`
  - `npm run build`
- PR作成までClaude Codeが担当してよい
- PRレビューは `.claude/agents/pr-reviewer.md` の観点で実施する

## 参照ドキュメント

詳細は以下を参照すること。

- `docs/product-requirements.md`
- `docs/ui-design-brief.md`
- `docs/architecture.md`
- `docs/development-workflow.md`
- `docs/testing-policy.md`
- `.claude/rules/*.md`
- `.claude/agents/*.md`
