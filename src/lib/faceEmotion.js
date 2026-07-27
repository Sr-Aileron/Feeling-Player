// face-api (@vladmandic/face-api) を使った表情推定。
// モデル重みは public/models/ に配置し、ブラウザ内で完結して推論する
// （顔画像は一切外部送信しない）。

import * as faceapi from '@vladmandic/face-api'

const MODEL_URL = '/models'

let loadPromise = null

/**
 * 必要なモデル(TinyFaceDetector + FaceExpressionNet)を一度だけロードする。
 */
export function loadModels() {
  if (!loadPromise) {
    loadPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ])
  }
  return loadPromise
}

/**
 * 画像要素(<img>/<canvas>/<video>)から表情を推定する。
 * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} input
 * @returns {Promise<{
 *   detected: boolean,
 *   top?: string,
 *   confidence?: number,
 *   expressions?: Record<string, number>,
 * }>}
 */
export async function detectEmotion(input) {
  await loadModels()

  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 320,
    scoreThreshold: 0.4,
  })

  const result = await faceapi
    .detectSingleFace(input, options)
    .withFaceExpressions()

  if (!result) {
    return { detected: false }
  }

  const expressions = result.expressions // { neutral, happy, ... }
  const entries = Object.entries(expressions)
  entries.sort((a, b) => b[1] - a[1])
  const [top, confidence] = entries[0]

  return {
    detected: true,
    top,
    confidence,
    expressions: Object.fromEntries(entries),
  }
}
