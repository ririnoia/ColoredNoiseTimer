// Noise generator functions — each returns an AudioNode connected to the given AudioContext
// All generators use ScriptProcessorNode for simplicity in MVP

import type { NoiseType } from './types'

export function createNoiseNode(
  ctx: AudioContext,
  type: NoiseType
): AudioBufferSourceNode {
  const bufferSize = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  switch (type) {
    case 'White Noise':
      fillWhite(data)
      break
    case 'Grey Noise':
      fillGrey(data)
      break
    case 'Pink Noise':
      fillPink(data)
      break
    case 'Brown Noise':
      fillBrown(data)
      break
    case 'Blue Noise':
      fillBlue(data)
      break
    case 'Violet Noise':
      fillViolet(data)
      break
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true
  return source
}

function fillWhite(data: Float32Array) {
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1
  }
}

function fillGrey(data: Float32Array) {
  // Equal-loudness weighted white noise (A-weighting approximation via simple shaping)
  fillWhite(data)
  // Apply mild high-shelf cut to approximate grey noise
  let b0 = 0
  for (let i = 0; i < data.length; i++) {
    b0 = 0.99 * b0 + data[i] * 0.01
    data[i] = (data[i] + b0) * 0.5
  }
}

function fillPink(data: Float32Array) {
  // Paul Kellet's pink noise approximation
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.96900 * b2 + white * 0.1538520
    b3 = 0.86650 * b3 + white * 0.3104856
    b4 = 0.55000 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.0168980
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
    b6 = white * 0.115926
  }
}

function fillBrown(data: Float32Array) {
  let lastOut = 0
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1
    lastOut = (lastOut + 0.02 * white) / 1.02
    data[i] = lastOut * 3.5
  }
}

function fillBlue(data: Float32Array) {
  // Blue noise: differentiated white noise (emphasizes high frequencies)
  let lastOut = 0
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1
    data[i] = white - lastOut
    lastOut = white
  }
  normalize(data)
}

function fillViolet(data: Float32Array) {
  // Violet noise: double-differentiated white noise
  let last1 = 0, last2 = 0
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1
    const blue = white - last1
    data[i] = blue - last2
    last2 = blue
    last1 = white
  }
  normalize(data)
}

function normalize(data: Float32Array) {
  let max = 0
  for (let i = 0; i < data.length; i++) {
    if (Math.abs(data[i]) > max) max = Math.abs(data[i])
  }
  if (max > 0) {
    for (let i = 0; i < data.length; i++) {
      data[i] /= max
    }
  }
}
