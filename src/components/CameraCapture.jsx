import { useRef, useState } from 'react'
import { useCamera } from '../hooks/useCamera.js'

/**
 * カメラプレビュー + スナップショット撮影 + 画像アップロード。
 * onCapture(canvasOrImageElement) を呼び出して判定処理へ渡す。
 */
export default function CameraCapture({ onCapture, busy }) {
  const { videoRef, active, error, start, stop, captureToCanvas } = useCamera()
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null) // dataURL for uploaded image

  const handleShoot = () => {
    const canvas = captureToCanvas()
    if (canvas) {
      setPreview(canvas.toDataURL('image/jpeg'))
      onCapture(canvas)
    }
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setPreview(url)
      onCapture(img)
    }
    img.src = url
  }

  return (
    <div className="card">
      <h2>1. 表情を取り込む</h2>

      <div className="camera-stage">
        {/* ライブプレビュー */}
        <video
          ref={videoRef}
          className="camera-video"
          playsInline
          muted
          style={{ display: active ? 'block' : 'none' }}
        />
        {/* 撮影/アップロードのプレビュー */}
        {!active && preview && (
          <img className="camera-video" src={preview} alt="取り込んだ画像" />
        )}
        {!active && !preview && (
          <div className="camera-placeholder">
            カメラを起動するか、画像をアップロードしてください
          </div>
        )}
      </div>

      {error && <p className="error">⚠️ {error}</p>}

      <div className="button-row">
        {!active ? (
          <button onClick={start} disabled={busy}>
            📷 カメラを起動
          </button>
        ) : (
          <>
            <button onClick={handleShoot} disabled={busy} className="primary">
              {busy ? '判定中…' : '撮影して判定'}
            </button>
            <button onClick={stop} disabled={busy}>
              停止
            </button>
          </>
        )}

        <button onClick={() => fileInputRef.current?.click()} disabled={busy}>
          🖼 画像から判定
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}
