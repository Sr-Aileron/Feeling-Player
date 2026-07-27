import { EMOTION_LABELS, MOOD_LABELS } from '../lib/emotionToMood.js'

const LOW_CONFIDENCE = 0.5

/**
 * 感情推定結果（各表情の確率バー）と、選定されたムードを表示する。
 */
export default function EmotionResult({ result, mood, onRetry }) {
  if (!result) return null

  if (!result.detected) {
    return (
      <div className="card">
        <h2>2. 判定結果</h2>
        <p className="error">
          顔を検出できませんでした。明るい場所で正面を向いて、もう一度お試しください。
        </p>
        {onRetry && <button onClick={onRetry}>もう一度</button>}
      </div>
    )
  }

  const { top, confidence, expressions } = result
  const lowConfidence = confidence < LOW_CONFIDENCE

  return (
    <div className="card">
      <h2>2. 判定結果</h2>

      <div className="result-headline">
        <span className="emotion-name">{EMOTION_LABELS[top] ?? top}</span>
        <span className="confidence">確信度 {(confidence * 100).toFixed(0)}%</span>
        <span className="mood-pill">→ {MOOD_LABELS[mood] ?? mood}</span>
      </div>

      {lowConfidence && (
        <p className="hint">
          確信度が低めです。表情をはっきりさせて撮り直すと精度が上がります。
          {onRetry && (
            <button className="link-button" onClick={onRetry}>
              撮り直す
            </button>
          )}
        </p>
      )}

      <div className="bars">
        {Object.entries(expressions).map(([emotion, value]) => (
          <div className="bar-row" key={emotion}>
            <span className="bar-label">{EMOTION_LABELS[emotion] ?? emotion}</span>
            <div className="bar-track">
              <div
                className={'bar-fill' + (emotion === top ? ' top' : '')}
                style={{ width: `${Math.round(value * 100)}%` }}
              />
            </div>
            <span className="bar-value">{Math.round(value * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
