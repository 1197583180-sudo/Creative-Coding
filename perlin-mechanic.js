const waveLines = [
  { speed: 38, baseY: 218, timeOffset: 3.2, rangeMin: 290, rangeMax: 420, colorKeys: ['cobalt', 'blue', 'skyBlue'],      history: [] },
  { speed: 45, baseY: 255, timeOffset: 0.0, rangeMin: 290, rangeMax: 420, colorKeys: ['cobalt', 'blue', 'skyBlue'],      history: [] },
  { speed: 30, baseY: 288, timeOffset: 4.7, rangeMin: 280, rangeMax: 450, colorKeys: ['prussian', 'cobalt', 'blue'],     history: [] },
  { speed: 36, baseY: 322, timeOffset: 1.8, rangeMin: 300, rangeMax: 480, colorKeys: ['prussian', 'cobalt', 'blue'],     history: [] },
  { speed: 35, baseY: 360, timeOffset: 2.5, rangeMin: 320, rangeMax: 450, colorKeys: ['cobalt', 'blue', 'skyBlue'],      history: [] },
  { speed: 40, baseY: 370, timeOffset: 5.8, rangeMin: 300, rangeMax: 500, colorKeys: ['prussian', 'cobalt', 'blue'],     history: [] },
  { speed: 45, baseY: 405, timeOffset: 1.1, rangeMin: 340, rangeMax: 520, colorKeys: ['darkNavy', 'prussian', 'cobalt'], history: [] },
  { speed: 50, baseY: 400, timeOffset: 3.7, rangeMin: 350, rangeMax: 550, colorKeys: ['darkNavy', 'prussian', 'cobalt'], history: [] },
];

const sampleSpacing = 15;
const noiseScale    = 0.003;
const waveAmplitude = 150;
const trailLength   = 135;

function updatePerlinWaveLines(currentTime) {
  for (const waveLine of waveLines) {
    waveLine.offset = constrain(map(noise(waveLine.timeOffset * 5.0, currentTime * waveLine.speed * 0.007), 0.25, 0.75, waveLine.rangeMin, waveLine.rangeMax), waveLine.rangeMin, waveLine.rangeMax) - waveLine.baseY;
    waveLine.history.push({ offset: waveLine.offset, time: currentTime });
    if (waveLine.history.length > trailLength) waveLine.history.shift();
  }
}

function getWaveSamples(centerY, timeOffset, currentTime, verticalNoiseScale = 0.06, noiseSpeed = 1) {
  const samples     = [];
  const sampleCount = floor(artworkWidth / sampleSpacing) + 3;
  for (let i = 0; i < sampleCount; i++) {
    samples.push({
      x: i * sampleSpacing - 10,
      n: noise(i * noiseScale * (centerY * verticalNoiseScale), currentTime * noiseSpeed + timeOffset),
    });
  }
  return samples;
}

function drawWaveLineLayers(centerY, timeOffset, alpha, colorKeys, currentTime) {
  const samples    = getWaveSamples(centerY, timeOffset, currentTime);
  const lastSample = samples[samples.length - 1];
  strokeWeight(1);
  noFill();
  for (let i = 0; i < colorKeys.length; i++) {
    const lineColor = waveColors[colorKeys[i]];
    const layerY    = centerY + i * 2.5;
    stroke(red(lineColor), green(lineColor), blue(lineColor), alpha);
    beginShape();
    curveVertex(-50, layerY);
    for (const s of samples) curveVertex(s.x, layerY + s.n * waveAmplitude);
    curveVertex(lastSample.x, layerY + lastSample.n * waveAmplitude);
    endShape();
  }
}

function drawBackgroundWaveBand(centerY, timeOffset, alpha, colorKeys, currentTime) {
  const samples    = getWaveSamples(centerY, timeOffset, currentTime, 0.04, 0.6);
  const lastSample = samples[samples.length - 1];
  const baseColor  = waveColors[colorKeys[0]];
  fill(red(baseColor), green(baseColor), blue(baseColor), alpha);
  noStroke();
  beginShape();
  vertex(-50, 700);
  curveVertex(samples[0].x, centerY + samples[0].n * waveAmplitude);
  for (const s of samples) curveVertex(s.x, centerY + s.n * waveAmplitude);
  curveVertex(lastSample.x, centerY + lastSample.n * waveAmplitude);
  vertex(lastSample.x + 50, 700);
  endShape(CLOSE);
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
  for (let angle = HALF_PI; angle < HALF_PI + TWO_PI; angle += 0.052) {
    const flicker = noise(angle * 0.8, currentTime * 1.5);
    stroke(232, 77, 28, flicker * 180);
    line(centerX, sunCenterY, centerX + cos(angle) * (sunRadius * 2.0 + flicker * sunRadius * 0.9), sunCenterY + sin(angle) * (sunRadius * 2.0 + flicker * sunRadius * 0.9));
  }
}
