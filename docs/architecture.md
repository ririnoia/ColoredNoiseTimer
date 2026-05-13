# Architecture

## 1. 基本方針

MVPではバックエンドを持たないフロントエンドのみの構成にします。

## 2. 技術構成

- Next.js
- TypeScript
- Tailwind CSS
- Web Audio API
- localStorage
- Vitest
- Testing Library
- Playwright
- ESLint

## 3. 推奨ディレクトリ構成

```txt
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── timer/
│   │   ├── TimerDisplay.tsx
│   │   ├── TimerControls.tsx
│   │   ├── ModeToggle.tsx
│   │   └── TimerSettings.tsx
│   ├── audio/
│   │   ├── NoiseSelector.tsx
│   │   ├── AudioControls.tsx
│   │   └── VolumeSlider.tsx
│   └── ads/
│       └── FutureAdSlot.tsx
├── hooks/
│   ├── usePomodoroTimer.ts
│   ├── useColoredNoise.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── noise/
│   │   ├── generators.ts
│   │   └── types.ts
│   ├── timer/
│   │   └── formatTime.ts
│   └── constants.ts
└── test/
    └── setup.ts
```

## 4. 音声生成

Web Audio APIで色名ノイズを生成します。

MVP対象:

- White Noise
- Grey Noise
- Pink Noise
- Brown Noise
- Blue Noise
- Violet Noise

### 注意点

- 音声再生はユーザー操作後に開始する
- AudioContextは必要なタイミングで作る
- 停止時はノードを適切に停止・切断する
- 音量はGainNodeで制御する
- タブを閉じたときやコンポーネント破棄時にクリーンアップする

## 5. タイマー

`usePomodoroTimer` にタイマー状態を集約します。

状態例:

- mode: `focus` / `break`
- isRunning
- remainingSeconds
- focusMinutes
- breakMinutes
- endSoundEnabled

## 6. ページタイトル更新

タイマー中は `document.title` を更新します。

例:

```txt
24:12 - Focus | ColoredNoiseTimer
04:58 - Break | ColoredNoiseTimer
```

停止中またはリセット後は以下に戻します。

```txt
ColoredNoiseTimer
```

## 7. 設定保存

localStorageに保存してよい設定:

- selectedNoise
- volume
- focusMinutes
- breakMinutes
- endSoundEnabled

保存しないもの:

- 作業履歴
- 個人情報
- アカウント情報
- 分析ログ

## 8. 広告枠

`FutureAdSlot` を作成するが、MVPでは表示しません。

- DOMに出さない、または `display: none`
- 実広告スクリプトは入れない
- 将来的にページ下部に小さく表示できる構造だけ用意する

## 9. 将来バックエンドが必要になる条件

以下を実装する場合にバックエンドを検討します。

- ユーザーアカウント
- 設定のクラウド同期
- 作業履歴
- 広告管理
- 利用統計
- 問い合わせ管理
