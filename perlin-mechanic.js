// 存放整件作品会重复使用的海浪颜色，由 Perlin noise 驱动的浪和背景浪共用。
// Stores reusable wave colors shared by the Perlin-noise-driven waves and the background wave.
let waveColors;

function setupWaveColors() {
  waveColors = {
    darkNavy : color('#021036'),
    prussian : color('#0B409C'),
    cobalt   : color('#0A7BC4'),
    blue     : color('#10B4E0'),
    skyBlue  : color('#48CCE8'),
  };
}

// 前景海浪的数据。每个对象代表一条独立的波浪线。
// Foreground wave data. Each object represents one independent wave line.
const waveLines = [
  { speed: 80, baseY: 218, timeOffset: 3.2, rangeMin: 300, rangeMax: 400, colorKeys: ['cobalt', 'blue', 'skyBlue'],      history: [] },
  { speed: 70, baseY: 255, timeOffset: 0.0, rangeMin: 310, rangeMax: 400, colorKeys: ['cobalt', 'blue', 'skyBlue'],      history: [] },
  { speed: 50, baseY: 288, timeOffset: 4.7, rangeMin: 310, rangeMax: 450, colorKeys: ['prussian', 'cobalt', 'blue'],     history: [] },
  { speed: 60, baseY: 322, timeOffset: 1.8, rangeMin: 320, rangeMax: 480, colorKeys: ['prussian', 'cobalt', 'blue'],     filled: true, history: [] },
  { speed: 50, baseY: 360, timeOffset: 2.5, rangeMin: 330, rangeMax: 470, colorKeys: ['cobalt', 'blue', 'skyBlue'],      history: [] },
  { speed: 40, baseY: 370, timeOffset: 5.8, rangeMin: 340, rangeMax: 520, colorKeys: ['prussian', 'cobalt', 'blue'],     history: [] },
  { speed: 45, baseY: 405, timeOffset: 1.1, rangeMin: 340, rangeMax: 520, colorKeys: ['darkNavy', 'prussian', 'cobalt'], history: [] },
  { speed: 50, baseY: 400, timeOffset: 3.7, rangeMin: 350, rangeMax: 550, colorKeys: ['darkNavy', 'prussian', 'cobalt'], history: [] },
];

// 每隔多少像素采样一个波浪点。数值越小，曲线越细腻但计算更多。
// Pixel distance between sampled wave points. Smaller values create smoother curves but require more calculation.
const sampleSpacing = 15;

// Perlin noise 横向缩放。数值越小，波浪越平滑、越宽。
// Horizontal scale for Perlin noise. Smaller values create smoother and wider wave shapes.
const noiseScale = 0.003;

// 将 noise 的 0-1 输出放大成实际波浪高度。
// Multiplies the 0-1 noise output into visible wave height.
const waveAmplitude = 150;

// 前景浪拖影保留的历史帧数。
// Number of historical foreground-wave states kept for trails.
const trailLength = 135;

function updatePerlinWaveLines(currentTime) {
  for (const waveLine of waveLines) {
    // 用 Perlin noise 生成每条浪的整体上下偏移。
    // Use Perlin noise to generate each wave line's overall vertical offset.
    //
    // timeOffset 让每条浪从不同噪声位置开始，speed 让每条浪变化速度不同。
    // timeOffset starts each wave at a different noise position, while speed gives each wave a different motion rate.
    const noiseValue = noise(waveLine.timeOffset * 5.0, currentTime * waveLine.speed * 0.007);

    // map 把 noise 值转换到该浪允许的 y 范围，再用 constrain 保证不会越界。
    // map converts the noise value into this wave's allowed y-range, then constrain keeps it inside that range.
    const mappedY = constrain(map(noiseValue, 0.25, 0.75, waveLine.rangeMin, waveLine.rangeMax), waveLine.rangeMin, waveLine.rangeMax);

    // offset 是相对 baseY 的偏移，后面绘制时会用 baseY + offset 得到实际位置。
    // offset is relative to baseY; drawing later uses baseY + offset as the actual position.
    waveLine.offset = mappedY - waveLine.baseY;

    // 记录当前状态，用于画拖影。这里保存 currentTime 是为了之后重画当时的 noise 形状。
    // Record the current state for trails. currentTime is saved so the old noise shape can be redrawn later.
    waveLine.history.push({ offset: waveLine.offset, time: currentTime });

    // 删除最旧记录，保持拖影长度稳定。
    // Remove the oldest record to keep the trail length stable.
    if (waveLine.history.length > trailLength) waveLine.history.shift();
  }
}

function getWaveSamples(centerY, timeOffset, currentTime, verticalNoiseScale = 0.06, noiseSpeed = 1) {
  // samples 存储整条波浪曲线上的采样点。
  // samples stores all sampled points along a wave curve.
  const samples = [];

  // 根据设计宽度和采样间距计算需要多少个点，额外加 3 个点让曲线覆盖边缘。
  // Calculate the point count from the design width and spacing, with 3 extra points to cover the edges.
  const sampleCount = floor(artworkWidth / sampleSpacing) + 3;

  for (let i = 0; i < sampleCount; i++) {
    // x 是采样点的横向位置。
    // x is the horizontal position of this sample.
    const x = i * sampleSpacing - 10;

    // n 是该点的 Perlin noise 高度值。
    // n is this sample point's Perlin noise height value.
    //
    // 第一个参数使用横向位置，第二个参数使用时间，因此曲线会平滑地随时间变化。
    // The first parameter uses horizontal position, and the second uses time, so the curve changes smoothly over time.
    const n = noise(i * noiseScale * (centerY * verticalNoiseScale), currentTime * noiseSpeed + timeOffset);

    samples.push({ x, n });
  }

  return samples;
}

function drawWaveLineLayers(centerY, timeOffset, alpha, colorKeys, currentTime, filled = false) {
  // 先根据当前时间和位置生成这条浪的采样点。
  // First generate this wave's sampled points from the current time and position.
  const samples = getWaveSamples(centerY, timeOffset, currentTime);
  const lastSample = samples[samples.length - 1];

  if (filled) {
    // 把曲线以下的区域填满到画面最底部，让这条浪呈现实心的水体效果，而不是只露出线条。
    // Fill the area below the curve all the way to the bottom of the canvas, giving this wave a solid body of water instead of only showing its outlines.
    const fillColor = waveColors[colorKeys[0]];
    noStroke();
    fill(red(fillColor), green(fillColor), blue(fillColor), alpha * 0.5);
    beginShape();
    vertex(-50, 700);
    curveVertex(samples[0].x, centerY + samples[0].n * waveAmplitude);
    for (const s of samples) curveVertex(s.x, centerY + s.n * waveAmplitude);
    curveVertex(lastSample.x, centerY + lastSample.n * waveAmplitude);
    vertex(lastSample.x + 50, 700);
    endShape(CLOSE);
  }

  strokeWeight(1);
  noFill();

  // 同一条浪会画多层颜色，制造浮世绘式的线条叠加感。
  // The same wave is drawn in multiple color layers to create a layered ukiyo-e-like line effect.
  for (let i = 0; i < colorKeys.length; i++) {
    const lineColor = waveColors[colorKeys[i]];

    // 每层颜色稍微下移，避免完全重叠。
    // Each color layer is shifted slightly downward so they do not perfectly overlap.
    const layerY = centerY + i * 2.5;

    stroke(red(lineColor), green(lineColor), blue(lineColor), alpha);
    beginShape();

    // curveVertex 会生成平滑曲线。开头和结尾额外给点可以让边缘更自然。
    // curveVertex creates a smooth curve. Extra start/end points make the edges behave more naturally.
    curveVertex(-50, layerY);
    for (const s of samples) curveVertex(s.x, layerY + s.n * waveAmplitude);
    curveVertex(lastSample.x, layerY + lastSample.n * waveAmplitude);
    endShape();
  }
}

function drawBackgroundWaveBand(centerY, timeOffset, alpha, colorKeys, currentTime) {
  // 背景浪使用更小的 verticalNoiseScale 和 noiseSpeed，所以运动更慢、更平稳。
  // The background wave uses smaller verticalNoiseScale and noiseSpeed, making it slower and calmer.
  const samples = getWaveSamples(centerY, timeOffset, currentTime, 0.04, 0.6);
  const lastSample = samples[samples.length - 1];
  const baseColor = waveColors[colorKeys[0]];

  // 先画一整块填充色，从波浪曲线一直封闭到底部。
  // First draw a filled band that closes from the wave curve down to the bottom.
  fill(red(baseColor), green(baseColor), blue(baseColor), alpha);
  noStroke();
  beginShape();
  vertex(-50, 700);
  curveVertex(samples[0].x, centerY + samples[0].n * waveAmplitude);
  for (const s of samples) curveVertex(s.x, centerY + s.n * waveAmplitude);
  curveVertex(lastSample.x, centerY + lastSample.n * waveAmplitude);
  vertex(lastSample.x + 50, 700);
  endShape(CLOSE);

  // 再在填充浪面上画细线，增加层次。
  // Then draw thin lines on top of the filled band to add visual depth.
  strokeWeight(0.05);
  noFill();
  for (let i = 0; i < colorKeys.length; i++) {
    const lineColor = waveColors[colorKeys[i]];
    stroke(red(lineColor), green(lineColor), blue(lineColor), alpha);
    beginShape();
    curveVertex(-50, centerY + i * 7);
    for (const s of samples) curveVertex(s.x, centerY + i * 7 + s.n * waveAmplitude);
    curveVertex(lastSample.x, centerY + i * 7 + lastSample.n * waveAmplitude);
    endShape();
  }
}

function drawPerlinSunRays(centerX, sunCenterY, sunRadius, currentTime) {
  strokeWeight(1.5);
  noFill();

  // 用角度循环画太阳放射线，每条线的长度和透明度由 Perlin noise 控制。
  // Loop through angles to draw sun rays; each ray's length and alpha are controlled by Perlin noise.
  for (let angle = HALF_PI; angle < HALF_PI + TWO_PI; angle += 0.052) {
    const flicker = noise(angle * 0.8, currentTime * 1.5);

    stroke(232, 77, 28, flicker * 180);
    line(
      centerX,
      sunCenterY,
      centerX + cos(angle) * (sunRadius * 2.0 + flicker * sunRadius * 0.9),
      sunCenterY + sin(angle) * (sunRadius * 2.0 + flicker * sunRadius * 0.9)
    );
  }
}
