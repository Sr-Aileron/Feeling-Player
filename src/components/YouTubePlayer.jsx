import YouTube from 'react-youtube'
import { youtubeProvider } from '../music/youtubeProvider.js'

/**
 * 選定されたムードに対応する YouTube 再生リストを再生する。
 * playlistValue は設定値(URLまたはID)。IFrame Player に list として渡す。
 */
export default function YouTubePlayer({ playlistValue, moodLabel }) {
  const resolved = playlistValue
    ? youtubeProvider.resolvePlaylist(playlistValue)
    : null

  if (!resolved) {
    return (
      <div className="card">
        <h2>3. 再生</h2>
        <p className="hint">
          「{moodLabel}」に対応する再生リストが未設定です。下の設定で YouTube
          再生リストを割り当ててください。
        </p>
      </div>
    )
  }

  const opts = {
    playerVars: {
      listType: 'playlist',
      list: resolved.id,
      autoplay: 1, // 「撮影して判定」ボタン起点なのでユーザージェスチャ内
    },
  }

  return (
    <div className="card">
      <h2>3. 再生 — {moodLabel}</h2>
      <div className="player-wrap">
        <YouTube
          opts={opts}
          className="yt-frame"
          iframeClassName="yt-iframe"
          key={resolved.id} /* IDが変わったら作り直して確実にロード */
        />
      </div>
    </div>
  )
}
