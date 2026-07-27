import { MOODS, MOOD_LABELS, MOOD_MODES } from '../lib/emotionToMood.js'
import { extractPlaylistId } from '../music/youtubeProvider.js'

/**
 * ムード → YouTube 再生リスト の割り当てと、モード(共感/気分転換)切替。
 * 値は親(App)が localStorage に永続化する。
 */
export default function MoodPlaylistSettings({
  playlists,
  onChangePlaylist,
  mode,
  onChangeMode,
}) {
  return (
    <div className="card">
      <h2>設定</h2>

      <div className="field">
        <label>選曲モード</label>
        <div className="mode-toggle">
          {Object.entries(MOOD_MODES).map(([key, { label, description }]) => (
            <button
              key={key}
              className={'toggle' + (mode === key ? ' active' : '')}
              onClick={() => onChangeMode(key)}
              title={description}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="hint">{MOOD_MODES[mode]?.description}</p>
      </div>

      <div className="field">
        <label>ムード別 YouTube 再生リスト</label>
        <p className="hint">
          各ムードに YouTube の再生リストURL（または再生リストID）を貼り付けてください。
          個人の再生リストで構いません（公開/限定公開なら再生可）。
        </p>
        {MOODS.map((mood) => {
          const value = playlists[mood] ?? ''
          const valid = !value || extractPlaylistId(value)
          return (
            <div className="playlist-row" key={mood}>
              <span className="playlist-mood">{MOOD_LABELS[mood]}</span>
              <input
                type="text"
                value={value}
                placeholder="https://www.youtube.com/playlist?list=..."
                onChange={(e) => onChangePlaylist(mood, e.target.value)}
                className={valid ? '' : 'invalid'}
              />
              {!valid && <span className="error small">ID を認識できません</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
