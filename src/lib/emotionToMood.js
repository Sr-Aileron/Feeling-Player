// 感情 → ムード（5バケット）への変換ロジック。
// face-api の表情ラベル: neutral / happy / sad / angry / fearful / disgusted / surprised
// ムードバケット: happy / energetic / chill / mellow / focus

export const MOODS = ['happy', 'energetic', 'chill', 'mellow', 'focus']

export const MOOD_LABELS = {
  happy: 'ハッピー',
  energetic: 'エネルギッシュ',
  chill: 'チル / 落ち着き',
  mellow: 'メロウ / しっとり',
  focus: 'フォーカス / ニュートラル',
}

export const EMOTION_LABELS = {
  neutral: '無表情',
  happy: '喜び',
  sad: '悲しみ',
  angry: '怒り',
  fearful: '不安',
  disgusted: '嫌悪',
  surprised: '驚き',
}

// 2つのモード:
// empathy   … 感情に寄り添う（同じ気分を増幅／受け止める）
// reframe   … 気分転換（ネガティブをポジティブ方向へ調整）
export const MOOD_MODES = {
  empathy: {
    label: '共感モード',
    description: '今の感情に寄り添う選曲',
    map: {
      happy: 'happy',
      surprised: 'energetic',
      angry: 'energetic', // 発散
      sad: 'mellow',
      fearful: 'chill',
      disgusted: 'chill',
      neutral: 'focus',
    },
  },
  reframe: {
    label: '気分転換モード',
    description: '前向きな気分へ誘導する選曲',
    map: {
      happy: 'happy',
      surprised: 'energetic',
      angry: 'chill',
      sad: 'happy',
      fearful: 'chill',
      disgusted: 'chill',
      neutral: 'focus',
    },
  },
}

export const DEFAULT_MODE = 'empathy'

/**
 * 感情ラベルとモードからムードを決定する。
 * @param {string} emotion face-api の表情ラベル
 * @param {'empathy'|'reframe'} mode
 * @returns {string} ムード
 */
export function emotionToMood(emotion, mode = DEFAULT_MODE) {
  const table = MOOD_MODES[mode]?.map ?? MOOD_MODES[DEFAULT_MODE].map
  return table[emotion] ?? 'focus'
}
