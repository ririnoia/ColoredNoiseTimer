# ColoredNoiseTimer

ColoredNoiseTimer は、色名ノイズを聞きながらポモドーロタイマーで集中できるシンプルなWebアプリです。

## コンセプト

余計な機能を増やさず、集中したい人がすぐに使える1ページの集中ツールを目指します。

## MVP機能

- 色名ノイズの選択
- Web Audio APIによるノイズ生成
- ノイズ再生 / 停止
- 音量調整
- ポモドーロタイマー
- 集中 / 休憩の切り替え
- 集中時間・休憩時間の変更
- タイマー終了音ON/OFF
- タイマー中のページタイトル更新
- 将来広告用の非表示コンポーネント

## MVPノイズ

- White Noise
- Grey Noise
- Pink Noise
- Brown Noise
- Blue Noise
- Violet Noise

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- Web Audio API
- Vitest
- Testing Library
- Playwright
- ESLint

## 開発開始例

```bash
npm install
npm run dev
```

## 品質チェック

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

## Claude Code / Figma MCP

Figma連携は、Claude Code向け公式Figmaプラグインを使う方針です。

```bash
claude plugin install figma@claude-plugins-official
```

## ドキュメント

- `CLAUDE.md`
- `docs/product-requirements.md`
- `docs/ui-design-brief.md`
- `docs/architecture.md`
- `docs/development-workflow.md`
- `docs/testing-policy.md`
