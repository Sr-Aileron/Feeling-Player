// ムード → YouTube 再生リストID の既定マッピング。
// ここは各自の「個人プレイリスト」に差し替える前提のプレースホルダ。
// 値は YouTube 再生リストID（URL の list= 以降）または再生リストURL全体でも可
// （youtubeProvider 側で ID を抽出する）。
//
// 例: https://www.youtube.com/playlist?list=PLxxxxxxxx の "PLxxxxxxxx" 部分。
//
// 下記はデモ用の公開プレイリスト例（動作確認用・自由に差し替え可）。

export const DEFAULT_MOOD_PLAYLISTS = {
  happy: '',
  energetic: '',
  chill: '',
  mellow: '',
  focus: '',
}
