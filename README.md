# 🎭→🎵 感情で選ぶ音楽プレイヤー（試作）

カメラ／画像から表情を読み取り、感情を判定し、その気分に合う音楽を
あなたの YouTube 再生リストから選んで再生する Web アプリの試作です。

## 特徴
- **ブラウザ内で完結**：表情解析はオンデバイス（face-api.js）で行い、画像を外部送信しません。
- **YouTube 再生**：再生リストID を直接ロードするため **APIキー/OAuth 不要**。
- **2つの選曲モード**：共感モード（気分に寄り添う）／気分転換モード（前向きへ誘導）。
- **音楽プロバイダ抽象**：将来 Spotify(Premium) 等へ差し替え可能な構造。

## セットアップ
```bash
npm install
npm run dev
# → http://localhost:5173 をブラウザで開く（カメラ許可が必要）
```
> モデル重みは `public/models/` に同梱済みです。

## 使い方
1. 右側の「設定」で、各ムード（ハッピー/エネルギッシュ/チル/メロウ/フォーカス）に
   **自分の YouTube 再生リストURL** を貼り付ける（localStorage に保存されます）。
2. 「📷 カメラを起動」→「撮影して判定」、または「🖼 画像から判定」で写真を選ぶ。
3. 感情が判定され、対応ムードの再生リストが自動再生されます。

## 構成
```
src/
  App.jsx                      全体の状態管理と配線
  hooks/useCamera.js           カメラ起動・スナップショット
  lib/faceEmotion.js           face-api モデルロード & 表情推定
  lib/emotionToMood.js         感情→ムード変換（共感/気分転換）
  music/provider.js            音楽プロバイダの抽象IF
  music/youtubeProvider.js     YouTube 実装（再生リストID抽出）
  components/                   CameraCapture / EmotionResult / YouTubePlayer / MoodPlaylistSettings
  config/defaultMoodPlaylists.js  既定のムード→再生リスト対応（空＝各自設定）
public/models/                 face-api モデル重み（tiny_face_detector + face_expression）
```

## 感情→ムードの対応
| 感情 | 共感モード | 気分転換モード |
|---|---|---|
| 喜び | happy | happy |
| 驚き | energetic | energetic |
| 怒り | energetic(発散) | chill |
| 悲しみ | mellow | happy |
| 不安 | chill | chill |
| 嫌悪 | chill | chill |
| 無表情 | focus | focus |

## 発展のアイデア
- YouTube Data API で「自分の再生リスト一覧から選ぶ」UI
- 姿勢推定（MediaPipe Pose）を加えて表情＋体勢で総合判定
- リアルタイム連続判定モード
- Spotify Premium 化時に `music/` に SpotifyProvider を追加
```
