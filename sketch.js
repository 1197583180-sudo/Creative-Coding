const PIXEL_W = 480;
const PIXEL_H = 320;

let fujiReference;
let fujiSkyLayer;

// Ocean layers with foam layers inserted every 3 normal layers.
// Foam layers are lighter-toned versions of their neighbours — +25 RGB,
// capped at 255 — so they read as a gentle highlight without colour jumping.
const OCEAN_LAYERS = [
  { baseY: 0.50, amp: 0.010, f1: 0.102, f2: 0.168, f3: 0.258, p1: 0.00, p2: 1.10, p3: 2.50, r: 162, g: 202, b: 232 },
  { baseY: 0.53, amp: 0.012, f1: 0.097, f2: 0.161, f3: 0.248, p1: 2.10, p2: 0.40, p3: 1.70, r: 148, g: 188, b: 222 },
  { baseY: 0.55, amp: 0.014, f1: 0.092, f2: 0.154, f3: 0.238, p1: 0.80, p2: 2.90, p3: 0.30, r: 134, g: 174, b: 212 },
  { baseY: 0.565,amp: 0.015, f1: 0.090, f2: 0.151, f3: 0.233, p1: 1.70, p2: 3.80, p3: 1.20, r: 152, g: 192, b: 232 }, // foam
  { baseY: 0.58, amp: 0.016, f1: 0.087, f2: 0.147, f3: 0.228, p1: 3.20, p2: 1.50, p3: 3.10, r: 120, g: 160, b: 202 },
  { baseY: 0.61, amp: 0.019, f1: 0.082, f2: 0.140, f3: 0.218, p1: 1.40, p2: 0.70, p3: 1.90, r: 106, g: 146, b: 191 },
  { baseY: 0.63, amp: 0.021, f1: 0.077, f2: 0.133, f3: 0.208, p1: 0.20, p2: 3.20, p3: 0.60, r:  92, g: 132, b: 180 },
  { baseY: 0.645,amp: 0.022, f1: 0.075, f2: 0.130, f3: 0.203, p1: 1.10, p2: 4.10, p3: 1.50, r: 110, g: 150, b: 200 }, // foam
  { baseY: 0.66, amp: 0.023, f1: 0.072, f2: 0.126, f3: 0.198, p1: 2.70, p2: 1.00, p3: 2.40, r:  79, g: 118, b: 169 },
  { baseY: 0.69, amp: 0.025, f1: 0.067, f2: 0.119, f3: 0.188, p1: 1.00, p2: 2.40, p3: 1.10, r:  66, g: 104, b: 158 },
  { baseY: 0.71, amp: 0.028, f1: 0.062, f2: 0.112, f3: 0.178, p1: 3.50, p2: 0.20, p3: 3.30, r:  54, g:  91, b: 147 },
  { baseY: 0.725,amp: 0.029, f1: 0.060, f2: 0.109, f3: 0.173, p1: 4.40, p2: 1.10, p3: 4.20, r:  73, g: 110, b: 167 }, // foam
  { baseY: 0.74, amp: 0.030, f1: 0.057, f2: 0.105, f3: 0.168, p1: 1.80, p2: 2.80, p3: 0.80, r:  43, g:  78, b: 136 },
  { baseY: 0.77, amp: 0.032, f1: 0.052, f2: 0.098, f3: 0.158, p1: 0.50, p2: 1.30, p3: 2.00, r:  33, g:  66, b: 124 },
  { baseY: 0.79, amp: 0.034, f1: 0.047, f2: 0.091, f3: 0.148, p1: 2.30, p2: 0.60, p3: 1.20, r:  25, g:  55, b: 112 },
  { baseY: 0.805,amp: 0.035, f1: 0.045, f2: 0.088, f3: 0.143, p1: 3.20, p2: 1.50, p3: 2.10, r:  46, g:  75, b: 131 }, // foam
  { baseY: 0.82, amp: 0.037, f1: 0.042, f2: 0.084, f3: 0.138, p1: 0.90, p2: 3.00, p3: 0.40, r:  18, g:  44, b: 100 },
  { baseY: 0.84, amp: 0.039, f1: 0.037, f2: 0.077, f3: 0.128, p1: 3.10, p2: 1.80, p3: 2.70, r:  13, g:  35, b:  88 },
  { baseY: 0.87, amp: 0.041, f1: 0.032, f2: 0.070, f3: 0.118, p1: 1.50, p2: 0.90, p3: 1.50, r:   9, g:  27, b:  76 },
  { baseY: 0.885,amp: 0.042, f1: 0.030, f2: 0.067, f3: 0.113, p1: 2.40, p2: 1.80, p3: 2.40, r:  32, g:  48, b:  95 }, // foam
  { baseY: 0.90, amp: 0.043, f1: 0.027, f2: 0.063, f3: 0.108, p1: 0.30, p2: 2.50, p3: 0.20, r:   6, g:  20, b:  64 },
  { baseY: 0.92, amp: 0.046, f1: 0.022, f2: 0.056, f3: 0.098, p1: 2.80, p2: 1.10, p3: 3.40, r:   4, g:  14, b:  54 },
  { baseY: 0.95, amp: 0.048, f1: 0.017, f2: 0.049, f3: 0.088, p1: 1.10, p2: 3.30, p3: 1.00, r:   3, g:  10, b:  44 },
  { baseY: 0.960,amp: 0.049, f1: 0.015, f2: 0.046, f3: 0.083, p1: 2.00, p2: 4.20, p3: 1.90, r:  27, g:  33, b:  64 }, // foam
  { baseY: 0.97, amp: 0.050, f1: 0.012, f2: 0.042, f3: 0.078, p1: 3.40, p2: 0.80, p3: 2.20, r:   2, g:   7, b:  34 },
  { baseY: 1.00, amp: 0.052, f1: 0.007, f2: 0.035, f3: 0.068, p1: 0.70, p2: 2.10, p3: 0.70, r:   1, g:   4, b:  25 },
];

function preload() {
  fujiReference = loadImage("images/japanese-mount-fuji-at-sunrise-or-sunset-simple-logo-japanese-culture-symbol-illustration-vector.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  smooth();
  buildSkyLayer();
}

function draw() {
  image(fujiSkyLayer, 0, 0);  // flat sky background
  drawFuji();                  // procedural Fuji — drawn behind ocean
  noSmooth();
  drawAnimatedOcean();         // ocean waves on top
  smooth();
}

// ---------- SKY ----------

function buildSkyLayer() {
  fujiSkyLayer = createGraphics(width, height);
  fujiSkyLayer.pixelDensity(1);
  fujiReference.loadPixels();
  const ci = 4 * floor(fujiReference.width / 2); // top-centre pixel
  fujiSkyLayer.background(
    fujiReference.pixels[ci],
    fujiReference.pixels[ci + 1],
    fujiReference.pixels[ci + 2]
  );
}

// ---------- FUJI (procedural, no image) ----------

function drawFuji() {
  const cx = width  * 0.58;
  const by = height * 0.72;
  const hw = width  * 0.28;

  const sunR  = height * 0.11;
  const sunCy = sunR + height * 0.12;
  const pk    = sunCy + sunR * 0.55;
  const mh    = by - pk;

  noStroke();

  // Sun
  fill(232, 77, 28);
  circle(cx, sunCy, sunR * 2);

  // Mountain body — straight linear slopes so snow aligns perfectly.
  fill(35, 65, 100);
  triangle(cx - hw, by, cx, pk, cx + hw, by);

  // Snow cap — triangle with wavy bottom edge, static.
  const snowBaseY = pk + mh * 0.28;
  const snowHW    = hw * 0.28;
  const wAmp      = mh * 0.040;
  const wFreq     = 0.065;
  const wStep     = snowHW / 50;

  // Snow — straight sides follow mountain slope exactly, wavy only on bottom.
  fill(242, 247, 255);
  beginShape();
  vertex(cx,          pk);           // peak
  vertex(cx + snowHW, snowBaseY);    // right slope corner — exactly on mountain slope
  for (let x = snowHW; x >= -snowHW; x -= wStep) {
    vertex(cx + x, snowBaseY + wAmp * abs(sin(x * wFreq)));
  }
  vertex(cx - snowHW, snowBaseY);    // left slope corner
  endShape(CLOSE);

  // Left-face shadow — same straight sides + wavy bottom, no extra edges
  fill(195, 215, 235, 150);
  beginShape();
  vertex(cx,          pk);
  vertex(cx,          snowBaseY);    // centre bottom (no offset)
  for (let x = 0; x >= -snowHW; x -= wStep) {
    vertex(cx + x, snowBaseY + wAmp * abs(sin(x * wFreq)));
  }
  vertex(cx - snowHW, snowBaseY);
  endShape(CLOSE);
}

// ---------- OCEAN ----------

function waveEdge(x, baseY, amp, f1, f2, f3, p1, p2, p3) {
  return baseY
    + sin(x * f1 + p1) * amp * 0.50
    + sin(x * f2 + p2) * amp * 0.30
    + sin(x * f3 + p3) * amp * 0.20;
}

function drawAnimatedOcean() {
  const cellW = width  / PIXEL_W;
  const cellH = height / PIXEL_H;
  noStroke();
  rectMode(CORNER);

  for (let i = 0; i < OCEAN_LAYERS.length; i++) {
    const L    = OCEAN_LAYERS[i];
    const bob  = sin(frameCount * (0.006 + i * 0.002) + i * 0.72) * (2 + i * 0.25) * cellH;
    const base = L.baseY * PIXEL_H;
    const amp  = L.amp   * PIXEL_H;
    fill(L.r, L.g, L.b);
    for (let x = 0; x < PIXEL_W; x++) {
      const sy  = constrain(waveEdge(x, base, amp, L.f1, L.f2, L.f3, L.p1, L.p2, L.p3) * cellH + bob, 0, height);
      const sx  = floor(x * cellW);
      const sw  = floor((x + 1) * cellW) - sx;
      rect(sx, sy, sw, height - sy);
    }
  }
  rectMode(CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildSkyLayer();
}
