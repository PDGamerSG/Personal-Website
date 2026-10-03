/**
 * Canvas engine for the home-page banner: a dot-matrix night sky with an
 * astronaut snake that plays itself until someone takes the controls.
 *
 * Everything is drawn in device pixels on integer "art pixel" units so the
 * sprites stay crisp at any devicePixelRatio. Two grids share the canvas:
 *   - the halftone grid (pitch = 2 units) renders a density field built each
 *     frame from the moon, planet, asteroids, nebula, stars and glows;
 *   - the snake grid (cell = 5 units) holds the game, wrapping at the edges.
 */

export type Mode = 'auto' | 'play' | 'over'
export type ThemeName = 'dark' | 'light'

export interface HudState {
  mode: Mode
  score: number
  best: number
}

interface Callbacks {
  onHud: (state: HudState) => void
  onFirstFrame: () => void
}

type RGB = [number, number, number]

interface Palette {
  dot: string
  dotAlpha: number
  head: RGB
  tail: RGB
  eye: string
  tongue: string
  helmet: string
  glass: string
  glassAlpha: number
  glint: string
  food: string
  core: string
  spark: string
}

const PALETTES: Record<ThemeName, Palette> = {
  dark: {
    dot: '#a3aac0',
    dotAlpha: 0.85,
    head: [236, 132, 96],
    tail: [140, 64, 48],
    eye: '#1b120e',
    tongue: '#ff5d6c',
    helmet: '#dfe3ee',
    glass: '#ffffff',
    glassAlpha: 0.07,
    glint: '#ffffff',
    food: '#f5c451',
    core: '#fff6d8',
    spark: '#f7d27a',
  },
  light: {
    dot: '#4a5370',
    dotAlpha: 0.7,
    head: [224, 112, 76],
    tail: [150, 68, 46],
    eye: '#1b120e',
    tongue: '#e5484d',
    helmet: '#3d4459',
    glass: '#ffffff',
    glassAlpha: 0.4,
    glint: '#8b93ab',
    food: '#e3a216',
    core: '#fff3c4',
    spark: '#d9961a',
  },
}

// right, down, left, up
const DX = [1, 0, -1, 0]
const DY = [0, 1, 0, -1]
const TAU = Math.PI * 2

const AUTO_MAX = 26
const AUTO_MIN = 6
const PLAY_START = 4
const MAX_FOOD = 5

const STAR_BIG = ['..#..', '.###.', '##O##', '.###.', '..#..']
const STAR_SMALL = ['.....', '..#..', '.#O#.', '..#..', '.....']

// Helmet: a one-unit pixel ring around the head, plus its glass interior.
const HELMET_RING: [number, number][] = []
const HELMET_GLASS: [number, number][] = []
for (let j = -6; j <= 5; j++) {
  for (let i = -6; i <= 5; i++) {
    const d = Math.hypot(i + 0.5, j + 0.5)
    if (Math.abs(d - 4.45) < 0.5) HELMET_RING.push([i, j])
    else if (d < 4) HELMET_GLASS.push([i, j])
  }
}
const HELMET_GLINT: [number, number][] = [
  [-3, -2],
  [-3, -1],
  [-2, -3],
]

interface Food {
  cell: number
  born: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  color: string
  plus: boolean
}

interface Ghost {
  cell: number
  born: number
}

interface Asteroid {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  rot: number
  vr: number
  seed: number
}

interface Meteor {
  x: number
  y: number
  vx: number
  vy: number
}

function hash2(x: number, y: number, s: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(s, 1442695041)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

function vnoise(x: number, y: number, s: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const a = hash2(xi, yi, s)
  const b = hash2(xi + 1, yi, s)
  const c = hash2(xi, yi + 1, s)
  const d = hash2(xi + 1, yi + 1, s)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const rand = (a: number, b: number) => a + Math.random() * (b - a)
const rgb = (c: RGB) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`
const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]
const scale = (c: RGB, k: number): RGB => [
  Math.min(255, c[0] * k),
  Math.min(255, c[1] * k),
  Math.min(255, c[2] * k),
]

export class SnakeEngine {
  private ctx: CanvasRenderingContext2D
  private palette: Palette = PALETTES.dark

  // canvas metrics, device pixels
  private dpr = 1
  private W = 0
  private H = 0
  private u = 3

  // snake grid
  private cell = 15
  private cols = 0
  private rows = 0
  private ox = 0
  private oy = 0

  // halftone grid
  private hp = 6
  private hcols = 0
  private hrows = 0
  private hox = 0
  private hoy = 0
  private density = new Float32Array(0)
  private base = new Float32Array(0)
  private stars: { i: number; phase: number; speed: number; amp: number }[] = []
  private asteroids: Asteroid[] = []
  private meteor: Meteor | null = null
  private nextMeteor = 4

  // game state
  private body: number[] = []
  private occ = new Uint8Array(0)
  private foodMap = new Uint8Array(0)
  private foods: Food[] = []
  private dir = 0
  private queue: number[] = []
  private mode: Mode = 'auto'
  private score = 0
  private best = 0
  private shedding = false
  private overAt = 0
  private respawnAt = -1
  private spawnT = 0
  private nextSparkle = 1

  // scratch buffers for path finding
  private seen = new Uint8Array(0)
  private firstDir = new Int8Array(0)
  private bfsQueue = new Int32Array(0)

  private particles: Particle[] = []
  private ghosts: Ghost[] = []
  private pointer: { x: number; y: number } | null = null

  private time = 0
  private acc = 0
  private lastFrame = 0
  private raf = 0
  private running = false
  private drewFirst = false
  private lastHud = ''
  private frameNo = 0

  constructor(
    private canvas: HTMLCanvasElement,
    private cb: Callbacks,
  ) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('2d context unavailable')
    this.ctx = ctx
  }

  // ── public API ────────────────────────────────────────────────────────

  setTheme(theme: ThemeName) {
    this.palette = PALETTES[theme]
    if (!this.running && this.W) this.render()
  }

  setBest(best: number) {
    this.best = best
    this.emitHud()
  }

  resize(cssW: number, cssH: number, dpr: number) {
    if (cssW < 1 || cssH < 1) return
    this.dpr = dpr
    this.W = Math.round(cssW * dpr)
    this.H = Math.round(cssH * dpr)
    this.canvas.width = this.W
    this.canvas.height = this.H

    this.u = Math.max(3, Math.round(4 * dpr))
    this.cell = this.u * 5
    this.hp = Math.max(4, Math.round(7 * dpr))

    const cols = Math.floor(this.W / this.cell)
    const rows = Math.floor(this.H / this.cell)
    this.ox = Math.floor((this.W - cols * this.cell) / 2)
    this.oy = Math.floor((this.H - rows * this.cell) / 2)

    this.hcols = Math.ceil(this.W / this.hp)
    this.hrows = Math.ceil(this.H / this.hp)
    this.hox = Math.floor((this.W - this.hcols * this.hp) / 2)
    this.hoy = Math.floor((this.H - this.hrows * this.hp) / 2)
    const hn = this.hcols * this.hrows
    this.density = new Float32Array(hn)
    this.base = new Float32Array(hn)
    this.seedSky()

    if (cols !== this.cols || rows !== this.rows) {
      this.cols = cols
      this.rows = rows
      const n = cols * rows
      this.occ = new Uint8Array(n)
      this.foodMap = new Uint8Array(n)
      this.seen = new Uint8Array(n)
      this.firstDir = new Int8Array(n)
      this.bfsQueue = new Int32Array(n)
      this.foods = []
      this.ghosts = []
      this.particles = []
      this.respawn()
      this.spawnFood()
    }
    this.render()
  }

  start() {
    if (this.running || !this.W) return
    this.running = true
    this.lastFrame = 0
    this.raf = requestAnimationFrame(this.frame)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  destroy() {
    this.stop()
  }

  setPointer(cssX: number, cssY: number) {
    this.pointer = { x: cssX * this.dpr, y: cssY * this.dpr }
  }

  clearPointer() {
    this.pointer = null
  }

  /** Drop a star where the visitor clicked; the autopilot goes after it. */
  dropFood(cssX: number, cssY: number) {
    const col = Math.floor((cssX * this.dpr - this.ox) / this.cell)
    const row = Math.floor((cssY * this.dpr - this.oy) / this.cell)
    if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) return
    let target = -1
    for (let r = 0; r < 3 && target < 0; r++) {
      for (let dy = -r; dy <= r && target < 0; dy++) {
        for (let dx = -r; dx <= r && target < 0; dx++) {
          const c = this.wrap(col + dx, row + dy)
          if (!this.occ[c] && !this.foodMap[c]) target = c
        }
      }
    }
    if (target < 0) return
    if (this.foods.length >= MAX_FOOD) {
      const old = this.foods.shift()!
      this.foodMap[old.cell] = 0
    }
    this.addFood(target)
    const [x, y] = this.cellCenter(target)
    this.burst(x, y, 6, this.palette.spark, true, 0.6)
  }

  /** Arrow key or swipe. Takes over from the autopilot on first input. */
  steer(dir: number) {
    if (this.mode === 'auto') {
      this.enterPlay(dir)
    } else if (this.mode === 'over') {
      if (this.time - this.overAt > 0.45) {
        this.respawn()
        this.enterPlay(dir)
      }
    } else if (this.queue.length < 3 && this.queue[this.queue.length - 1] !== dir) {
      this.queue.push(dir)
    }
  }

  play() {
    this.steer(this.mode === 'over' ? 0 : this.dir)
  }

  exitPlay() {
    if (this.mode !== 'play') return
    this.mode = 'auto'
    this.queue = []
    this.emitHud()
  }

  // ── loop ──────────────────────────────────────────────────────────────

  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame)
    // cap at ~60fps on high refresh screens
    if (this.lastFrame && now - this.lastFrame < 15) return
    const dt = this.lastFrame ? Math.min(0.05, (now - this.lastFrame) / 1000) : 0.016
    this.lastFrame = now
    this.time += dt

    this.acc += dt * 1000
    const tick = this.tickMs()
    let steps = 0
    while (this.acc >= tick && steps < 3) {
      this.acc -= tick
      this.step()
      steps++
    }
    if (steps === 3) this.acc = 0

    this.update(dt)
    this.render()
  }

  private tickMs() {
    if (this.mode === 'play') return Math.max(68, 118 - this.score * 2.5)
    return 105
  }

  // ── game ──────────────────────────────────────────────────────────────

  private wrap(x: number, y: number) {
    const c = ((x % this.cols) + this.cols) % this.cols
    const r = ((y % this.rows) + this.rows) % this.rows
    return r * this.cols + c
  }

  private neighbor(cell: number, d: number) {
    return this.wrap((cell % this.cols) + DX[d], ((cell / this.cols) | 0) + DY[d])
  }

  private cellOrigin(cell: number): [number, number] {
    return [this.ox + (cell % this.cols) * this.cell, this.oy + ((cell / this.cols) | 0) * this.cell]
  }

  private cellCenter(cell: number): [number, number] {
    const [x, y] = this.cellOrigin(cell)
    return [x + 2 * this.u, y + 2 * this.u]
  }

  private respawn() {
    this.occ.fill(0)
    this.body = []
    this.dir = 0
    this.queue = []
    this.shedding = false
    this.respawnAt = -1
    const row = Math.floor(rand(1, Math.max(2, this.rows - 1)))
    const x0 = Math.floor(rand(2, Math.max(3, this.cols / 3)))
    for (let k = 0; k < AUTO_MIN; k++) {
      const c = this.wrap(x0 + AUTO_MIN - 1 - k, row)
      this.body.push(c)
      this.occ[c]++
      if (this.foodMap[c]) this.removeFood(c)
    }
    this.spawnT = this.time
    const [x, y] = this.cellCenter(this.body[0])
    this.burst(x, y, 10, this.palette.spark, true, 0.8)
  }

  private enterPlay(dir: number) {
    this.mode = 'play'
    this.score = 0
    this.shedding = false
    this.queue = [dir]
    while (this.body.length > PLAY_START) {
      const t = this.body.pop()!
      this.occ[t]--
      const [x, y] = this.cellCenter(t)
      this.burst(x, y, 2, rgb(this.palette.tail), false, 0.5)
    }
    if (!this.foods.length) this.spawnFood()
    this.emitHud()
  }

  private step() {
    if (this.mode === 'over' || !this.body.length) return

    let d = this.dir
    if (this.mode === 'play') {
      while (this.queue.length) {
        const nd = this.queue.shift()!
        if (nd !== (this.dir + 2) % 4 && nd !== this.dir) {
          d = nd
          break
        }
      }
    } else {
      d = this.autopilot()
    }
    if (d < 0) {
      this.die()
      return
    }
    this.dir = d

    const next = this.neighbor(this.body[0], d)
    const eating = this.foodMap[next] === 1
    if (!eating) {
      const tail = this.body.pop()!
      this.occ[tail]--
      this.ghosts.push({ cell: tail, born: this.time })
    }
    if (this.occ[next] > 0) {
      this.die()
      return
    }
    this.body.unshift(next)
    this.occ[next]++
    if (eating) this.eat(next)

    if (this.mode === 'auto' && this.body.length > AUTO_MAX) this.shedding = true
    if (this.shedding) {
      if (this.body.length > AUTO_MIN) {
        const t = this.body.pop()!
        this.occ[t]--
        const [x, y] = this.cellCenter(t)
        this.burst(x, y, 3, this.palette.spark, true, 0.7)
      } else {
        this.shedding = false
      }
    }
  }

  private eat(cell: number) {
    this.removeFood(cell)
    const [x, y] = this.cellCenter(cell)
    this.burst(x, y, 12, this.palette.food, false, 0.9)
    this.burst(x, y, 4, this.palette.spark, true, 0.8)
    if (this.mode === 'play') {
      this.score++
      if (this.score > this.best) this.best = this.score
      this.emitHud()
    }
    if (!this.foods.length) this.spawnFood()
  }

  private die() {
    const head = this.body[0]
    for (let k = 0; k < this.body.length; k++) {
      const [x, y] = this.cellCenter(this.body[k])
      const c = rgb(mix(this.palette.head, this.palette.tail, k / Math.max(1, this.body.length - 1)))
      this.burst(x, y, 3, c, false, 1.1)
    }
    if (head !== undefined) {
      const [x, y] = this.cellCenter(head)
      this.burst(x, y, 8, this.palette.helmet, true, 1)
    }
    this.occ.fill(0)
    this.body = []
    if (this.mode === 'play') {
      this.mode = 'over'
      this.overAt = this.time
      this.emitHud()
    } else {
      this.respawnAt = this.time + 0.9
    }
  }

  private addFood(cell: number) {
    this.foods.push({ cell, born: this.time })
    this.foodMap[cell] = 1
  }

  private removeFood(cell: number) {
    this.foodMap[cell] = 0
    this.foods = this.foods.filter((f) => f.cell !== cell)
  }

  private spawnFood() {
    const head = this.body[0] ?? 0
    const hx = head % this.cols
    const hy = (head / this.cols) | 0
    for (let tries = 0; tries < 80; tries++) {
      const x = Math.floor(rand(1, this.cols - 1))
      const y = Math.floor(rand(1, this.rows - 1))
      const c = y * this.cols + x
      if (this.occ[c] || this.foodMap[c]) continue
      if (Math.abs(x - hx) + Math.abs(y - hy) < 5) continue
      this.addFood(c)
      return
    }
  }

  /** Blocked for path finding. The tail cell frees up as the snake moves. */
  private blocked(c: number) {
    const tail = this.body[this.body.length - 1]
    return this.occ[c] > 0 && !(c === tail && this.occ[c] === 1)
  }

  /** Count reachable cells from `start`, stopping once `limit` is reached. */
  private flood(start: number, limit: number) {
    const seen = this.seen
    const q = this.bfsQueue
    seen.fill(0)
    let h = 0
    let t = 0
    q[t++] = start
    seen[start] = 1
    while (h < t && t < limit) {
      const c = q[h++]
      for (let d = 0; d < 4; d++) {
        const nb = this.neighbor(c, d)
        if (!seen[nb] && !this.blocked(nb)) {
          seen[nb] = 1
          q[t++] = nb
        }
      }
    }
    return t
  }

  /** Breadth-first search to the nearest star, with a flood-fill safety check. */
  private autopilot(): number {
    const head = this.body[0]
    const reverse = (this.dir + 2) % 4
    const order = [0, 1, 2, 3].filter((d) => d !== reverse).sort(() => Math.random() - 0.5)
    const seen = this.seen
    const first = this.firstDir
    const q = this.bfsQueue
    seen.fill(0)
    seen[head] = 1
    let h = 0
    let t = 0
    for (const d of order) {
      const c = this.neighbor(head, d)
      if (seen[c] || this.blocked(c)) continue
      seen[c] = 1
      first[c] = d
      q[t++] = c
    }
    let target = -1
    while (h < t) {
      const c = q[h++]
      if (this.foodMap[c]) {
        target = first[c]
        break
      }
      for (let d = 0; d < 4; d++) {
        const nb = this.neighbor(c, d)
        if (seen[nb] || this.blocked(nb)) continue
        seen[nb] = 1
        first[nb] = first[c]
        q[t++] = nb
      }
    }

    const need = this.body.length + 2
    if (target >= 0 && this.flood(this.neighbor(head, target), need) >= need) return target

    // no safe path to food: head for the most open space
    let best = -1
    let bestArea = -1
    for (const d of order) {
      const c = this.neighbor(head, d)
      if (this.blocked(c)) continue
      const area = this.flood(c, need * 3)
      if (area > bestArea) {
        bestArea = area
        best = d
      }
    }
    return best
  }

  // ── simulation of the sky and effects ─────────────────────────────────

  private seedSky() {
    const n = this.hcols * this.hrows
    this.stars = []
    for (let i = 0; i < n; i++) {
      const r = Math.random()
      if (r < 0.012) {
        this.stars.push({ i, phase: rand(0, TAU), speed: rand(0.6, 2.2), amp: rand(0.35, 0.95) })
      } else if (r < 0.05) {
        // static dust, the faint speckle between objects
        this.stars.push({ i, phase: 0, speed: 0, amp: rand(0.05, 0.14) })
      }
    }
    this.asteroids = Array.from({ length: 6 }, () => this.makeAsteroid(rand(0, this.W)))
    this.frameNo = 0
  }

  private makeAsteroid(x: number): Asteroid {
    const H = this.H
    return {
      x,
      y: rand(H * 0.08, H * 0.92),
      r: rand(H * 0.025, H * 0.07),
      vx: -rand(H * 0.012, H * 0.04),
      vy: rand(-H * 0.004, H * 0.004),
      rot: rand(0, TAU),
      vr: rand(-0.3, 0.3),
      seed: rand(0, 100),
    }
  }

  private update(dt: number) {
    if (this.mode === 'over' && this.time - this.overAt > 2.6) {
      this.mode = 'auto'
      this.score = 0
      this.respawn()
      this.emitHud()
    }
    if (this.respawnAt > 0 && this.time >= this.respawnAt) this.respawn()

    for (const a of this.asteroids) {
      a.x += a.vx * dt
      a.y += a.vy * dt
      a.rot += a.vr * dt
    }
    for (let k = 0; k < this.asteroids.length; k++) {
      const a = this.asteroids[k]
      if (a.x < -a.r * 2) this.asteroids[k] = this.makeAsteroid(this.W + rand(a.r * 2, this.W * 0.3))
    }

    if (this.meteor) {
      this.meteor.x += this.meteor.vx * dt
      this.meteor.y += this.meteor.vy * dt
      if (this.meteor.x < -this.W * 0.2 || this.meteor.y > this.H * 1.3) this.meteor = null
    } else if (this.time > this.nextMeteor) {
      this.meteor = {
        x: rand(this.W * 0.35, this.W * 1.05),
        y: -this.H * 0.1,
        vx: -this.W * rand(0.45, 0.7),
        vy: this.H * rand(0.7, 1.1),
      }
      this.nextMeteor = this.time + rand(6, 13)
    }

    // ambient sparkles around the helmet, like dust catching the light
    if (this.body.length && this.time > this.nextSparkle) {
      const [x, y] = this.cellCenter(this.body[0])
      const u = this.u
      this.particles.push({
        x: x + Math.round(rand(-9, 9)) * u,
        y: y + Math.round(rand(-8, 8)) * u,
        vx: 0,
        vy: 0,
        life: 0.7,
        max: 0.7,
        color: this.palette.spark,
        plus: true,
      })
      this.nextSparkle = this.time + rand(0.5, 1.4)
    }

    for (const p of this.particles) {
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vx *= 0.94
      p.vy *= 0.94
      p.life -= dt
    }
    this.particles = this.particles.filter((p) => p.life > 0)
    this.ghosts = this.ghosts.filter((g) => this.time - g.born < 0.9)
  }

  private burst(x: number, y: number, count: number, color: string, plus: boolean, life: number) {
    const speed = this.u * 28
    for (let k = 0; k < count; k++) {
      const a = rand(0, TAU)
      const s = rand(0.3, 1) * speed
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: life * rand(0.6, 1),
        max: life,
        color,
        plus,
      })
    }
  }

  // ── rendering ─────────────────────────────────────────────────────────

  private render() {
    const { ctx } = this
    ctx.clearRect(0, 0, this.W, this.H)
    this.buildField()
    this.drawField()
    this.drawGhosts()
    this.drawFood()
    this.drawSnake()
    this.drawParticles()
    ctx.globalAlpha = 1
    if (!this.drewFirst) {
      this.drewFirst = true
      this.cb.onFirstFrame()
    }
  }

  /** Visit every halftone point within `R` of (cx, cy) and add fn's value. */
  private splat(cx: number, cy: number, R: number, fn: (dx: number, dy: number) => number) {
    const { hp, hox, hoy, hcols, hrows, density } = this
    const i0 = Math.max(0, Math.floor((cx - R - hox) / hp))
    const i1 = Math.min(hcols - 1, Math.ceil((cx + R - hox) / hp))
    const j0 = Math.max(0, Math.floor((cy - R - hoy) / hp))
    const j1 = Math.min(hrows - 1, Math.ceil((cy + R - hoy) / hp))
    for (let j = j0; j <= j1; j++) {
      const py = hoy + j * hp + hp / 2 - cy
      for (let i = i0; i <= i1; i++) {
        const v = fn(hox + i * hp + hp / 2 - cx, py)
        if (v > 0) density[j * hcols + i] += v
      }
    }
  }

  private buildField() {
    const { W, H, time, hcols, hrows, density, base } = this

    // nebula: sparse clusters from thresholded value noise, refreshed every 4th frame
    if (this.frameNo++ % 4 === 0) {
      for (let j = 0; j < hrows; j++) {
        for (let i = 0; i < hcols; i++) {
          // a broad mask decides where debris lives, a finer layer breaks it into clumps
          const mask = vnoise(i * 0.06 + time * 0.1, j * 0.09, 7)
          const grain = vnoise(i * 0.34 - time * 0.25, j * 0.34 + time * 0.06, 13)
          const n = mask * 0.55 + grain * 0.45
          base[j * hcols + i] = Math.max(0, n - 0.64) * 2.6
        }
      }
    }
    density.set(base)

    for (const s of this.stars) {
      if (s.speed === 0) {
        density[s.i] += s.amp
      } else {
        const tw = 0.5 + 0.5 * Math.sin(time * s.speed + s.phase)
        density[s.i] += s.amp * (0.15 + 0.85 * tw * tw)
      }
    }

    // crescent moon, brightest along its outer limb
    {
      const r = H * 0.26
      const cx = W * 0.13 + Math.sin(time * 0.07) * H * 0.03
      const cy = H * 0.44 + Math.sin(time * 0.11) * H * 0.02
      const sx = r * 0.4
      const sy = -r * 0.14
      const r2 = r * 0.86
      this.splat(cx, cy, r, (dx, dy) => {
        const d = Math.hypot(dx, dy)
        if (d > r) return 0
        const d2 = Math.hypot(dx - sx, dy - sy)
        const lit = clamp01((d2 - r2) / (r * 0.16))
        return lit * (0.3 + 0.7 * (d / r)) * clamp01((r - d) / (r * 0.08))
      })
    }

    // ringed planet in the lower right, lit from the upper left
    {
      const r = H * 0.4
      const cx = W * 0.87 + Math.sin(time * 0.05) * H * 0.02
      const cy = H * 0.95
      const a = r * 1.85
      const b = r * 0.36
      const cos = Math.cos(-0.32)
      const sin = Math.sin(-0.32)
      const lx = -0.55
      const ly = -0.62
      const lz = 0.56
      this.splat(cx, cy, a, (dx, dy) => {
        const qx = dx * cos + dy * sin
        const qy = -dx * sin + dy * cos
        const rho = Math.hypot(qx / a, qy / b)
        const inRing = rho > 0.74 && rho < 1 && !(rho > 0.86 && rho < 0.89)
        const d2 = dx * dx + dy * dy
        const inPlanet = d2 < r * r
        if (inRing && (qy > 0 || !inPlanet)) return 0.42 + 0.2 * (1 - rho)
        if (!inPlanet) return 0
        const nx = dx / r
        const ny = dy / r
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny))
        const shade = Math.max(0, nx * lx + ny * ly + nz * lz)
        const bands = 0.82 + 0.18 * Math.sin(ny * 15 + nx * 2)
        return (0.05 + 0.85 * Math.pow(shade, 1.3)) * bands
      })
    }

    // lumpy asteroids drifting left
    for (const ast of this.asteroids) {
      const R = ast.r * 1.4
      this.splat(ast.x, ast.y, R, (dx, dy) => {
        const th = Math.atan2(dy, dx) + ast.rot
        const rr =
          ast.r *
          (1 + 0.2 * Math.sin(3 * th + ast.seed) + 0.1 * Math.sin(5 * th + ast.seed * 2) + 0.05 * Math.sin(8 * th))
        const d = Math.hypot(dx, dy)
        if (d > rr) return 0
        const lit = clamp01(0.5 - (dx + dy) / (2.6 * rr))
        return 0.14 + 0.7 * lit
      })
    }

    // shooting star: a short fading streak of dots
    if (this.meteor) {
      const m = this.meteor
      for (let k = 0; k < 14; k++) {
        const x = m.x - m.vx * k * 0.012
        const y = m.y - m.vy * k * 0.012
        const i = Math.round((x - this.hox - this.hp / 2) / this.hp)
        const j = Math.round((y - this.hoy - this.hp / 2) / this.hp)
        if (i >= 0 && j >= 0 && i < hcols && j < hrows) density[j * hcols + i] += 0.95 * (1 - k / 14)
      }
    }

    // stars glow into the dot grid around them
    const glowR = this.cell * 1.6
    for (const f of this.foods) {
      const [x, y] = this.cellCenter(f.cell)
      const pulse = 0.22 + 0.08 * Math.sin(time * 5 + f.cell)
      this.splat(x, y, glowR, (dx, dy) => {
        const t = 1 - Math.hypot(dx, dy) / glowR
        return t > 0 ? pulse * t * t : 0
      })
    }

    // helmet lamp
    if (this.body.length) {
      const [x, y] = this.cellCenter(this.body[0])
      const R = this.cell * 2.4
      this.splat(x + DX[this.dir] * this.cell * 0.8, y + DY[this.dir] * this.cell * 0.8, R, (dx, dy) => {
        const t = 1 - Math.hypot(dx, dy) / R
        return t > 0 ? 0.16 * t * t : 0
      })
    }

    // cursor flashlight reveals the grid underneath
    if (this.pointer) {
      const R = 95 * this.dpr
      this.splat(this.pointer.x, this.pointer.y, R, (dx, dy) => {
        const t = 1 - Math.hypot(dx, dy) / R
        return t > 0 ? 0.5 * t * t : 0
      })
    }
  }

  private drawField() {
    const { ctx, hp, hox, hoy, hcols, hrows, density, palette } = this
    const BUCKETS = 7
    const paths = Array.from({ length: BUCKETS }, () => new Path2D())
    for (let j = 0; j < hrows; j++) {
      const y = hoy + j * hp + hp / 2
      for (let i = 0; i < hcols; i++) {
        let d = density[j * hcols + i]
        if (d < 0.06) continue
        if (d > 1) d = 1
        const b = Math.min(BUCKETS - 1, (d * BUCKETS) | 0)
        const r = hp * (0.12 + 0.3 * d)
        const x = hox + i * hp + hp / 2
        const p = paths[b]
        p.moveTo(x + r, y)
        p.arc(x, y, r, 0, TAU)
      }
    }
    ctx.fillStyle = palette.dot
    for (let b = 0; b < BUCKETS; b++) {
      ctx.globalAlpha = palette.dotAlpha * (0.26 + (0.74 * (b + 0.5)) / BUCKETS)
      ctx.fill(paths[b])
    }
    ctx.globalAlpha = 1
  }

  private drawGhosts() {
    const { ctx, u } = this
    ctx.fillStyle = rgb(this.palette.tail)
    for (const g of this.ghosts) {
      const age = (this.time - g.born) / 0.9
      const [x, y] = this.cellOrigin(g.cell)
      ctx.globalAlpha = 0.4 * (1 - age)
      const s = age < 0.5 ? 2 : 1
      const off = age < 0.5 ? 1 : 1.5
      ctx.fillRect(x + Math.round(off * u), y + Math.round(off * u), s * u, s * u)
    }
    ctx.globalAlpha = 1
  }

  private drawSprite(x: number, y: number, rows: string[], fill: string, core: string) {
    const { ctx, u } = this
    for (let j = 0; j < rows.length; j++) {
      for (let i = 0; i < rows[j].length; i++) {
        const ch = rows[j][i]
        if (ch === '.') continue
        ctx.fillStyle = ch === 'O' ? core : fill
        ctx.fillRect(x + i * u, y + j * u, u, u)
      }
    }
  }

  private drawFood() {
    const { ctx, u, time, palette } = this
    for (let k = 0; k < this.foods.length; k++) {
      const f = this.foods[k]
      const [x, y] = this.cellOrigin(f.cell)
      const age = time - f.born
      const big = age > 0.3 && Math.floor(time * 2.6 + k * 0.7) % 2 === 0
      ctx.globalAlpha = Math.min(1, age * 4)
      this.drawSprite(x, y, big ? STAR_BIG : STAR_SMALL, palette.food, palette.core)
      // two orbiting glints
      const a = time * 2.4 + k
      ctx.globalAlpha = 0.5 + 0.5 * Math.sin(time * 6 + k)
      ctx.fillStyle = palette.spark
      const cx = x + 2 * u
      const cy = y + 2 * u
      ctx.fillRect(cx + Math.round(Math.cos(a) * 4) * u, cy + Math.round(Math.sin(a) * 4) * u, u, u)
      ctx.fillRect(cx - Math.round(Math.cos(a) * 4) * u, cy - Math.round(Math.sin(a) * 4) * u, u, u)
    }
    ctx.globalAlpha = 1
  }

  private drawSnake() {
    const { ctx, u, body, palette } = this
    if (!body.length) return
    ctx.globalAlpha = clamp01((this.time - this.spawnT) / 0.4)
    const n = body.length
    const block = 4 * u

    // body, tail first so the neck overlaps it
    for (let k = n - 1; k >= 1; k--) {
      const c = body[k]
      const [x, y] = this.cellOrigin(c)
      const col = mix(palette.head, palette.tail, k / Math.max(1, n - 1))
      const shade = rgb(scale(col, 0.72))
      ctx.fillStyle = rgb(col)
      ctx.fillRect(x, y, block, block)
      // connector toward the previous segment, if it's an actual neighbour
      const p = body[k - 1]
      const [px, py] = this.cellOrigin(p)
      if (py === y && Math.abs(px - x) === this.cell) {
        ctx.fillRect(Math.min(px, x) + block, y, u, block)
        ctx.fillStyle = shade
        ctx.fillRect(Math.min(px, x) + block, y + 3 * u, u, u)
      } else if (px === x && Math.abs(py - y) === this.cell) {
        ctx.fillRect(x, Math.min(py, y) + block, block, u)
      }
      ctx.fillStyle = shade
      ctx.fillRect(x, y + 3 * u, block, u)
      if (k % 2 === 0) {
        ctx.fillStyle = rgb(scale(col, 1.18))
        ctx.fillRect(x + u, y + u, u, u)
      }
    }

    const head = body[0]
    const [X, Y] = this.cellOrigin(head)
    const d = this.dir
    const cx = X + 2 * u
    const cy = Y + 2 * u

    // glass behind the head
    ctx.save()
    ctx.globalAlpha *= palette.glassAlpha
    ctx.fillStyle = palette.glass
    for (const [i, j] of HELMET_GLASS) ctx.fillRect(cx + i * u, cy + j * u, u, u)
    ctx.restore()

    // head: 5 units long in the direction of travel, 4 across
    const px = (f: number, s: number, color: string) => {
      let gx: number
      let gy: number
      if (d === 0) {
        gx = X + f * u
        gy = Y + s * u
      } else if (d === 2) {
        gx = X + (3 - f) * u
        gy = Y + s * u
      } else if (d === 1) {
        gx = X + s * u
        gy = Y + f * u
      } else {
        gx = X + s * u
        gy = Y + (3 - f) * u
      }
      ctx.fillStyle = color
      ctx.fillRect(gx, gy, u, u)
    }
    const headCol = rgb(palette.head)
    const headShade = rgb(scale(palette.head, 0.78))
    for (let f = 0; f < 5; f++) {
      for (let s = 0; s < 4; s++) {
        if (f === 4 && (s === 0 || s === 3)) continue
        px(f, s, headCol)
      }
    }
    // shade the underside so the head reads as round
    if (d === 0 || d === 2) {
      for (let f = 0; f < 4; f++) px(f, 3, headShade)
    } else if (d === 1) {
      px(4, 1, headShade)
      px(4, 2, headShade)
    } else {
      for (let s = 0; s < 4; s++) px(0, s, headShade)
    }
    px(3, 0, palette.eye)
    px(3, 3, palette.eye)
    // the occasional tongue flick
    if (this.time % 2.3 < 0.2) {
      px(5, 1, palette.tongue)
      px(5, 2, palette.tongue)
    }

    // helmet ring and glints
    ctx.fillStyle = palette.helmet
    const a = ctx.globalAlpha
    ctx.globalAlpha = a * 0.9
    for (const [i, j] of HELMET_RING) ctx.fillRect(cx + i * u, cy + j * u, u, u)
    ctx.fillStyle = palette.glint
    for (const [i, j] of HELMET_GLINT) ctx.fillRect(cx + i * u, cy + j * u, u, u)
    ctx.globalAlpha = a * 0.45
    ctx.fillRect(cx + 2 * u, cy + 2 * u, u, u)
    ctx.globalAlpha = 1
  }

  private drawParticles() {
    const { ctx, u } = this
    for (const p of this.particles) {
      const t = p.life / p.max
      ctx.globalAlpha = Math.min(1, t * 1.6)
      ctx.fillStyle = p.color
      const x = Math.round(p.x / u) * u
      const y = Math.round(p.y / u) * u
      if (p.plus && t > 0.4) {
        ctx.fillRect(x - u, y, 3 * u, u)
        ctx.fillRect(x, y - u, u, 3 * u)
      } else {
        ctx.fillRect(x, y, u, u)
      }
    }
    ctx.globalAlpha = 1
  }

  private emitHud() {
    const key = `${this.mode}:${this.score}:${this.best}`
    if (key === this.lastHud) return
    this.lastHud = key
    this.cb.onHud({ mode: this.mode, score: this.score, best: this.best })
  }
}
