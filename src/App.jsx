import { useEffect, useMemo, useState } from 'react'
import CameraCapture from './components/CameraCapture.jsx'
import EmotionResult from './components/EmotionResult.jsx'
import YouTubePlayer from './components/YouTubePlayer.jsx'
import MoodPlaylistSettings from './components/MoodPlaylistSettings.jsx'
import { detectEmotion, loadModels } from './lib/faceEmotion.js'
import {
  DEFAULT_MODE,
  MOOD_LABELS,
  emotionToMood,
} from './lib/emotionToMood.js'
import { DEFAULT_MOOD_PLAYLISTS } from './config/defaultMoodPlaylists.js'
import './music/youtubeProvider.js' // プロバイダ登録の副作用

const LS_PLAYLISTS = 'emp.playlists'
const LS_MODE = 'emp.mode'

function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [modelsReady, setModelsReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)

  const [mode, setMode] = useState(() => loadLS(LS_MODE, DEFAULT_MODE))
  const [playlists, setPlaylists] = useState(() =>
    loadLS(LS_PLAYLISTS, DEFAULT_MOOD_PLAYLISTS),
  )

  // モデルを事前ロード（初回判定の待ち時間を短縮）
  useEffect(() => {
    loadModels()
      .then(() => setModelsReady(true))
      .catch(() => setModelsReady(false))
  }, [])

  // 永続化
  useEffect(() => {
    localStorage.setItem(LS_MODE, JSON.stringify(mode))
  }, [mode])
  useEffect(() => {
    localStorage.setItem(LS_PLAYLISTS, JSON.stringify(playlists))
  }, [playlists])

  const mood = useMemo(
    () => (result?.detected ? emotionToMood(result.top, mode) : null),
    [result, mode],
  )

  const handleCapture = async (inputEl) => {
    setBusy(true)
    try {
      const res = await detectEmotion(inputEl)
      setResult(res)
    } catch (err) {
      setResult({ detected: false, error: err?.message })
    } finally {
      setBusy(false)
    }
  }

  const handleChangePlaylist = (m, value) =>
    setPlaylists((prev) => ({ ...prev, [m]: value }))

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎭 → 🎵 感情で選ぶ音楽プレイヤー</h1>
        <p className="subtitle">
          表情から気分を読み取り、あなたの YouTube 再生リストから合う音楽を再生します。
          <br />
          <span className="privacy">
            画像はブラウザ内でのみ解析され、外部に送信されません。
          </span>
        </p>
        {!modelsReady && (
          <p className="hint">感情判定モデルを読み込み中…</p>
        )}
      </header>

      <main className="grid">
        <div className="col">
          <CameraCapture onCapture={handleCapture} busy={busy} />
          {result && (
            <EmotionResult
              result={result}
              mood={mood}
              onRetry={() => setResult(null)}
            />
          )}
        </div>

        <div className="col">
          {mood && (
            <YouTubePlayer
              playlistValue={playlists[mood]}
              moodLabel={MOOD_LABELS[mood] ?? mood}
            />
          )}
          <MoodPlaylistSettings
            playlists={playlists}
            onChangePlaylist={handleChangePlaylist}
            mode={mode}
            onChangeMode={setMode}
          />
        </div>
      </main>
    </div>
  )
}
