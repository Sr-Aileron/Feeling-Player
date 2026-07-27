// 音楽プロバイダの抽象インターフェース。
// 将来 Spotify(Premium) 等に差し替えられるよう、UI からはこの形だけに依存する。
//
// MusicProvider の実装は最低限、以下を満たす:
//   - id: string
//   - resolvePlaylist(rawValue): { id: string } | null   // 設定値 → 再生可能なID
//   - <YouTubePlayer 等の再生コンポーネント側でこの id を使う>
//
// 現状は YouTube 実装(youtubeProvider)のみ。

export const PROVIDERS = {}

export function registerProvider(provider) {
  PROVIDERS[provider.id] = provider
  return provider
}

export function getProvider(id) {
  return PROVIDERS[id] ?? null
}
