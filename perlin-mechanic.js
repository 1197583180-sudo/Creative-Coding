// Foreground wave data. Each object represents one independent wave line.
const waveLines = [
  { speed: 80, baseY: 218, timeOffset: 3.2, rangeMin: 290, rangeMax: 400, colorKeys: ['cobalt', 'blue', 'skyBlue'],      history: [] },
  { speed: 70, baseY: 255, timeOffset: 0.0, rangeMin: 290, rangeMax: 400, colorKeys: ['cobalt', 'blue', 'skyBlue'],      history: [] },
  { speed: 30, baseY: 288, timeOffset: 4.7, rangeMin: 310, rangeMax: 450, colorKeys: ['prussian', 'cobalt', 'blue'],     history: [] },
  { speed: 36, baseY: 322, timeOffset: 1.8, rangeMin: 320, rangeMax: 480, colorKeys: ['prussian', 'cobalt', 'blue'],     history: [] },
  { speed: 35, baseY: 360, timeOffset: 2.5, rangeMin: 330, rangeMax: 450, colorKeys: ['cobalt', 'blue', 'skyBlue'],      history: [] },
  { speed: 40, baseY: 370, timeOffset: 5.8, rangeMin: 340, rangeMax: 500, colorKeys: ['prussian', 'cobalt', 'blue'],     history: [] },
  { speed: 45, baseY: 405, timeOffset: 1.1, rangeMin: 340, rangeMax: 520, colorKeys: ['darkNavy', 'prussian', 'cobalt'], history: [] },
  { speed: 50, baseY: 400, timeOffset: 3.7, rangeMin: 350, rangeMax: 550, colorKeys: ['darkNavy', 'prussian', 'cobalt'], history: [] },
];

// Pixel distance between sampled wave points. Smaller values create smoother curves but require more calculation.
const sampleSpacing = 15;

// Horizontal scale for Perlin noise. Smaller values create smoother and wider wave shapes.
const noiseScale = 0.003;

// Multiplies the 0-1 noise output into visible wave height.
const waveAmplitude = 150;

// Number of historical foreground-wave states kept for trails.
const trailLength = 135;

function updatePerlinWaveLines(currentTime) {
  for (const waveLine of waveLines) {
    // Use Perlin noise to generate each wave line's overall vertical offset.
    //
    // timeOffset starts each wave at a different noise position, while speed gives each wave a different motion rate.
    const noiseValue = noise(waveLine.timeOffset * 5.0, currentTime * waveLine.speed * 0.007);

    // map converts the noise value into this wave's allowed y-range, then constrain keeps it inside that range.
    const mappedY = constrain(map(noiseValue, 0.25, 0.75, waveLine.rangeMin, waveLine.rangeMax), waveLine.rangeMin, waveLine.rangeMax);

    // offset is relative to baseY; drawing later uses baseY + offset as the actual position.
    waveLine.offset = mappedY - waveLine.baseY;

    // Record the current state for trails. currentTime is saved so the old noise shape can be redrawn later.
    waveLine.history.push({ offset: waveLine.offset, time: currentTime });

    // Remove the oldest record to keep the trail length stable.
    if (waveLine.history.length > trailLength) waveLine.history.shift();
  }
}

function getWaveSamples(centerY, timeOffset, currentTime, verticalNoiseScale = 0.06, noiseSpeed = 1) {
  // samples stores all sampled points along a wave curve.
  const samples = [];

  // Calculate the point count from the design width and spacing, with 3 extra points to cover the edges.
  const sampleCount = floor(artworkWidth / sampleSpacing) + 3;

  for (let i = 0; i < sampleCount; i++) {
    // x is the horizontal position of this sample.
    const x = i * sampleSpacing - 10;

    // n is this sample point's Perlin noise height value.
    //
    // The first parameter uses horizontal position, and the second uses time, so the curve changes smoothly over time.
    const n = noise(i * noiseScale * (centerY * verticalNoiseScale), currentTime * noiseSpeed + timeOffset);

    samples.push({ x, n });
  }

  return samples;
}

function drawWaveLineLayers(centerY, timeOffset, alpha, colorKeys, currentTime) {
  // First generate this wave's sampled points from the current time and position.
  const samples = getWaveSamples(centerY, timeOffset, currentTime);
  const lastSample = samples[samples.length - 1];

  strokeWeight(1);
  noFill();

  // The same wave is drawn in multiple color layers to create a layered ukiyo-e-like line effect.
  for (let i = 0; i < colorKeys.length; i++) {
    const lineColor = waveColors[colorKeys[i]];

    // Each color layer is shifted slightly downward so they do not perfectly overlap.
    const layerY = centerY + i * 2.5;

    stroke(red(lineColor), green(lineColor), blue(lineColor), alpha);
    beginShape();

    // curveVertex creates a smooth curve. Extra start/end points make the edges behave more naturally.
    curveVertex(-50, layerY);
    for (const s of samples) curveVertex(s.x, layerY + s.n * getTotalWaveAmplitude());
    curveVertex(lastSample.x, layerY + lastSample.n * waveAmplitude);
    endShape();
  }
}

function drawBackgroundWaveBand(centerY, timeOffset, alpha, colorKeys, currentTime) {
  // The background wave uses smaller verticalNoiseScale and noiseSpeed, making it slower and calmer.
  const samples = getWaveSamples(centerY, timeOffset, currentTime, 0.04, 0.6);
  const lastSample = samples[samples.length - 1];
  const baseColor = waveColors[colorKeys[0]];

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
