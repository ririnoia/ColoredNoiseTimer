# Development Workflow

## 1. 基本方針

Claude Codeは実装前に必ず作業計画を提示します。

## 2. ブランチ運用

- `main` への直接pushは禁止
- 作業は必ず `feature/*` ブランチで行う
- ブランチ名は英数字・ハイフンのみ
- 日本語ブランチ名は禁止

例:

```txt
feature/setup-nextjs
feature/add-pomodoro-timer
feature/add-colored-noise
feature/add-ui-tests
```

## 3. PR運用

- 原則1機能1PR
- 大きな変更は分割する
- PR作成までClaude Codeが担当してよい
- PR本文には以下を含める
  - 変更概要
  - 確認したこと
  - 実行したコマンド
  - スクリーンショットまたはUI確認メモ
  - 懸念点

## 4. PR前チェック

PR前に必ず実行します。

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

## 5. Claude Codeへの依頼テンプレート

```md
以下の作業をお願いします。

目的:
- 

制約:
- 実装前に作業計画を出してください
- 変更は小さく分けてください
- UIは日本語、ノイズ名は英語にしてください
- スマホ対応を必須にしてください
- 作業後に lint / test / test:e2e / build を実行してください

完了条件:
- 
```

## 6. Figma MCPを使う作業

Figma関連作業では以下を守ります。

- Claude Code公式Figmaプラグインを使用する
- デザイン意図を先に整理する
- いきなり実装せず、コンポーネント構成を確認する
- Figmaから取得した情報をTailwind CSSへ反映する
- 実装後にUI差分を確認する

## 7. 大きな変更で確認が必要なもの

Claude Codeは以下を行う前に確認します。

- 依存パッケージの追加
- 大量ファイル削除
- ディレクトリ構成の大幅変更
- バックエンド追加
- DB追加
- 広告スクリプト追加
- 認証機能追加
- GitHub ActionsなどCI設定の大幅変更
