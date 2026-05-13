# Figma MCP Setup

ColoredNoiseTimerでは、Figma MCPを使う場合、Claude Code向け公式Figmaプラグインを使います。

## 推奨セットアップ

```bash
claude plugin install figma@claude-plugins-official
```

## 運用方針

- `.mcp.json` を手動で書くより、公式プラグインを優先する
- Figmaで画面を作る前に、`docs/ui-design-brief.md` を確認する
- Claude CodeにはFigma URLと実装対象コンポーネントを明示する
- 生成されたUIは必ずスマホ表示で確認する

## Claude Code依頼例

```md
Figma MCPを使って、ColoredNoiseTimerのMVPホーム画面を設計してください。

要件:
- 日本語UI
- ノイズ名だけ英語
- スマホファースト
- 1ページ構成
- とにかくシンプル
- タイマーを大きく表示
- Tailwind CSSで実装しやすい構造
```
