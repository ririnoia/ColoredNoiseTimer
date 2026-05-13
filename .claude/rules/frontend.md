# Frontend Rules

## 技術

- Next.js + TypeScriptを使用する
- Tailwind CSSを使用する
- 不要なUIライブラリは追加しない
- コンポーネントは小さく分割する
- 状態管理ライブラリはMVPでは追加しない

## 実装

- タイマー処理はhookに分離する
- 音声処理はhookまたはlibに分離する
- localStorage処理は共通hookにする
- 副作用はuseEffectで明示的に管理する
- cleanupを忘れない

## アクセシビリティ

- ボタンには意味のあるラベルを付ける
- スライダーにはラベルを付ける
- キーボード操作を妨げない
- コントラストを確保する
