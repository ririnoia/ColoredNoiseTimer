# Testing Policy

## 1. テスト方針

MVPでも、最低限の品質を担保するために以下を導入します。

- ESLint
- Vitest
- Testing Library
- Playwright
- build確認

## 2. テスト対象

### Unit / Component

Vitest + Testing Libraryで確認します。

- タイマー表示
- タイマー開始 / 停止 / リセット
- 集中 / 休憩切り替え
- 設定変更
- localStorage保存
- 音量スライダー
- ノイズ選択UI

### E2E

Playwrightで確認します。

- ページが表示される
- タイマーを開始できる
- タイマーを停止できる
- リセットできる
- 集中 / 休憩を切り替えられる
- ノイズ再生ボタンを押せる
- 音量を変更できる
- スマホサイズで主要操作が見える

## 3. Web Audio APIの扱い

Web Audio APIはテスト環境で完全再生を検証しにくいため、以下の方針にします。

- 音声生成ロジックは可能な範囲で関数分離する
- ブラウザAPI依存部分は薄くする
- テストではモックを使用する
- E2Eでは「ボタン操作でエラーが出ない」ことを確認する

## 4. PR前必須コマンド

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

## 5. 完了条件

機能実装PRは以下を満たすこと。

- lintが通る
- unit/component testが通る
- e2e testが通る
- buildが通る
- スマホ表示が破綻していない
- UI文言ルールに違反していない
