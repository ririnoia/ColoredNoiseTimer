# Testing Rules

## 必須

PR前に以下を実行する。

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

## テスト観点

- タイマーの開始 / 停止 / リセット
- 集中 / 休憩の切り替え
- 設定変更
- localStorage保存
- ノイズ選択
- 音声再生ボタン
- 音量変更
- スマホ表示

## 注意

- Web Audio APIはモックを活用する
- ブラウザ依存処理を直接テストしすぎない
- テストしやすいようにロジックを分離する
