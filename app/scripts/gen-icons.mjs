// Generates icon-192.png and icon-512.png — a green rounded square with a
// white smiley. Pure Node (zlib), no native deps.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public')
mkdirSync(OUT, { recursive: true })

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
]
const BG = hex('#0b141a')
const GREEN = hex('#25d366')
const WHITE = [255, 255, 255]

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function makePNG(size) {
  const px = new Uint8Array(size * size * 4)
  const r = size * 0.235 // corner radius
  const cx = size / 2
  const eyeY = size * 0.42
  const eyeR = size * 0.07
  const eyeDX = size * 0.16
  const smileR = size * 0.24
  const smileY = size * 0.46
  const smileW = size * 0.045

  const set = (x, y, [rr, gg, bb], a = 255) => {
    const i = (y * size + x) * 4
    px[i] = rr
    px[i + 1] = gg
    px[i + 2] = bb
    px[i + 3] = a
  }

  const inRounded = (x, y) => {
    const m = size * 0.02
    const lo = m,
      hi = size - m
    let dx = 0,
      dy = 0
    if (x < lo + r) dx = lo + r - x
    else if (x > hi - r) dx = x - (hi - r)
    if (y < lo + r) dy = lo + r - y
    else if (y > hi - r) dy = y - (hi - r)
    if (x < lo || x > hi || y < lo || y > hi) return false
    return dx * dx + dy * dy <= r * r
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!inRounded(x, y)) {
        set(x, y, BG, 0)
        continue
      }
      // eyes
      const e1 = Math.hypot(x - (cx - eyeDX), y - eyeY)
      const e2 = Math.hypot(x - (cx + eyeDX), y - eyeY)
      if (e1 <= eyeR || e2 <= eyeR) {
        set(x, y, BG)
        continue
      }
      // smile (lower arc of a ring)
      const ds = Math.hypot(x - cx, y - smileY)
      if (
        Math.abs(ds - smileR) <= smileW &&
        y > smileY + smileR * 0.25
      ) {
        set(x, y, BG)
        continue
      }
      set(x, y, GREEN)
    }
  }
  void WHITE

  // raw image data with filter byte (0) per row
  const stride = size * 4
  const raw = Buffer.alloc((stride + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0
    Buffer.from(px.buffer, y * stride, stride).copy(raw, y * (stride + 1) + 1)
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const idat = deflateSync(raw, { level: 9 })

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const size of [192, 512]) {
  const buf = makePNG(size)
  writeFileSync(join(OUT, `icon-${size}.png`), buf)
  console.log(`wrote icon-${size}.png (${buf.length} bytes)`)
}
