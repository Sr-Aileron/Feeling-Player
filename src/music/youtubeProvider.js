import { registerProvider } from './provider.js'

// YouTube プロバイダ。
// 再生リストID を直接 IFrame Player に渡す方式のため、APIキー/OAuth は不要。
// 設定値は「再生リストURL全体」でも「ID(PL... / OL... など)」でも受け付ける。

/**
 * 入力からYouTube再生リストIDを抽出する。
 * 対応: 完全URL(?list=), 生ID, watch?...&list=... 形式。
 * @param {string} raw
 * @returns {string|null}
 */
export function extractPlaylistId(raw) {
  if (!raw) return null
  const value = String(raw).trim()
  if (!value) return null

  // URL に list= が含まれる場合はそれを優先
  const listMatch = value.match(/[?&]list=([^&]+)/)
  if (listMatch) return listMatch[1]

  // URL ではなく生のIDっぽい文字列（PL/OL/UU/FL/RD などで始まる or 英数記号のみ）
  if (!value.includes('/') && !value.includes(' ')) return value

  return null
}

export const youtubeProvider = registerProvider({
  id: 'youtube',
  label: 'YouTube',
  resolvePlaylist(rawValue) {
    const id = extractPlaylistId(rawValue)
    return id ? { id } : null
  },
})
