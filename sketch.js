let noiseTime = 0;
let waveColors;

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

const backgroundLines = [
  { dir: 1, speed: 12, baseY: 300, timeOffset: 5.5, y: 300, colorKeys: ['darkNavy', 'darkNavy'], history: [] },
];

const sampleSpacing         = 15;
const noiseScale            = 0.003;
const artworkWidth          = 1000;
const artworkHeight         = 500;
const waveAmplitude         = 150;
const trailLength           = 135;
const backgroundTrailLength = 23;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(displayDensity());
  frameRate(45);
  waveColors = {
    darkNavy : color('#021036'),
    prussian : color('#0B409C'),
    cobalt   : color('#0A7BC4'),
    blue     : color('#10B4E0'),
    skyBlue  : color('#48CCE8'),
  };
}

function draw() {
  drawBackgroundGradient();

  const deltaSeconds = min(deltaTime, 50) / 1000;
  noiseTime += deltaSeconds * 0.36;

  for (const waveLine of waveLines) {
    waveLine.offset = constrain(map(noise(waveLine.timeOffset * 5.0, noiseTime * waveLine.speed * 0.007), 0.25, 0.75, waveLine.rangeMin, waveLine.rangeMax), waveLine.rangeMin, waveLine.rangeMax) - waveLine.baseY;
    waveLine.history.push({ offset: waveLine.offset, time: noiseTime });
    if (waveLine.history.length > trailLength) waveLine.history.shift();
  }

  for (const backgroundLine of backgroundLines) {
    backgroundLine.y += backgroundLine.dir * backgroundLine.speed * deltaSeconds;
    if (backgroundLine.y >= 300) { backgroundLine.y = 300; backgroundLine.dir = -1; }
    if (backgroundLine.y <= 290) { backgroundLine.y = 290; backgroundLine.dir =  1; }
    backgroundLine.offset = backgroundLine.y - backgroundLine.baseY;
    backgroundLine.history.push({ offset: backgroundLine.offset, time: noiseTime });
    if (backgroundLine.history.length > backgroundTrailLength) backgroundLine.history.shift();
  }

  drawMountainAndSun();

  const artworkScale   = max(width / artworkWidth, height / artworkHeight);
  const artworkOffsetX = (width  - artworkWidth  * artworkScale) / 2;
  const artworkOffsetY = (height - artworkHeight * artworkScale) / 2;

  push();
  translate(artworkOffsetX, artworkOffsetY);
  scale(artworkScale);
  translate(0, -40);

  const currentNoiseTime = noiseTime;
  const boatPhase = noiseTime * 2;
  const placeBoat = (baseX, baseY, boatWidth, direction = 1) => {
    push();
    translate(baseX + cos(boatPhase * 0.5) * 55 * direction, baseY + sin(boatPhase) * 18 * direction);
    rotate(sin(boatPhase) * radians(5) * direction);
    drawBoat(0, 0, boatWidth);
    pop();
  };

  placeBoat(800, 370, 130, -1);

  for (const backgroundLine of backgroundLines) {
    for (let i = 0; i < backgroundLine.history.length; i++) {
      noiseTime = backgroundLine.history[i].time;
      drawBackgroundWaveBand(backgroundLine.baseY + backgroundLine.history[i].offset, backgroundLine.timeOffset, 255 * i / max(1, backgroundLine.history.length - 1), backgroundLine.colorKeys);
    }
    noiseTime = currentNoiseTime;
    drawBackgroundWaveBand(backgroundLine.baseY + backgroundLine.offset, backgroundLine.timeOffset, 255, backgroundLine.colorKeys);
  }

  const drawWaveLine = (waveLine) => {
    for (let i = 0; i < waveLine.history.length; i++) {
      noiseTime = waveLine.history[i].time;
      drawWaveLineLayers(waveLine.baseY + waveLine.history[i].offset, waveLine.timeOffset, 255 * i / max(1, waveLine.history.length - 1), waveLine.colorKeys);
    }
    noiseTime = currentNoiseTime;
    drawWaveLineLayers(waveLine.baseY + waveLine.offset, waveLine.timeOffset, 255, waveLine.colorKeys);
  };

  for (let i = 0; i < 3; i++) drawWaveLine(waveLines[i]);

  placeBoat(650, 400, 260);

  for (let i = 3; i < waveLines.length; i++) drawWaveLine(waveLines[i]);

  pop();
}

function drawWaveLineLayers(centerY, timeOffset, alpha, colorKeys) {
  const samples    = getWaveSamples(centerY, timeOffset);
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

function drawBoat(x, y, boatWidth) {
  const boatHeight   = boatWidth * 0.24;
  const left         = x - boatWidth / 2;
  const right        = x + boatWidth / 2;
  const tipY         = y - boatHeight * 0.12;
  const bottomLeftX  = left + boatWidth * 0.18;
  const bottomRightX = right - boatWidth * 0.18;
  const bottomY      = y + boatHeight * 0.55;

  const drawHull = () => {
    const cornerCut = 0.28;
    beginShape();
    vertex(left, tipY);
    vertex(lerp(left, bottomLeftX, 1 - cornerCut), lerp(tipY, bottomY, 1 - cornerCut));
    quadraticVertex(bottomLeftX, bottomY, lerp(bottomLeftX, bottomRightX, cornerCut), bottomY);
    vertex(lerp(bottomLeftX, bottomRightX, 1 - cornerCut), bottomY);
    quadraticVertex(bottomRightX, bottomY, lerp(bottomRightX, right, cornerCut), lerp(bottomY, tipY, cornerCut));
    vertex(right, tipY);
    quadraticVertex(x, y + boatHeight * 0.18, left, tipY);
    endShape(CLOSE);
  };

  noStroke();
  const hullBaseColor = color('#B98A55');
  const shadeOf       = (steps) => lerpColor(hullBaseColor, color(0), steps * 0.18);

  const bandEdgesAt = (t) => ({
    bandY:  lerp(tipY, bottomY, t),
    leftX:  lerp(left, bottomLeftX, t),
    rightX: lerp(right, bottomRightX, t),
  });
  const fillAboveBand = ({ bandY, leftX, rightX }) => {
    beginShape();
    vertex(left, tipY);
    vertex(leftX, bandY);
    quadraticVertex(x, bandY + boatHeight * 0.08, rightX, bandY);
    vertex(right, tipY);
    quadraticVertex(x, y + boatHeight * 0.18, left, tipY);
    endShape(CLOSE);
  };

  fill(shadeOf(3));
  drawHull();

  fill(shadeOf(2));
  fillAboveBand(bandEdgesAt(3 / 4));

  fill(shadeOf(1));
  fillAboveBand(bandEdgesAt(2 / 4));

  fill(shadeOf(0));
  fillAboveBand(bandEdgesAt(1 / 4));

  stroke('#5E3F22');
  strokeWeight(0.5);
  noFill();
  drawHull();
}

function getWaveSamples(centerY, timeOffset, verticalNoiseScale = 0.06, noiseSpeed = 1) {
  const samples     = [];
  const sampleCount = floor(artworkWidth / sampleSpacing) + 3;
  for (let i = 0; i < sampleCount; i++) {
    samples.push({
      x: i * sampleSpacing - 10,
      n: noise(i * noiseScale * (centerY * verticalNoiseScale), noiseTime * noiseSpeed + timeOffset),
    });
  }
  return samples;
}

function drawBackgroundWaveBand(centerY, timeOffset, alpha, colorKeys) {
  const samples    = getWaveSamples(centerY, timeOffset, 0.04, 0.6);
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

function drawBackgroundGradient() {
  const gradient = drawingContext.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0,    '#F0E2C0');
  gradient.addColorStop(0.50, '#F0E2C0');
  gradient.addColorStop(1,    '#0A7BC4');
  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawMountainAndSun() {
  const centerX           = width  * 0.75;
  const mountainBaseY     = height * 0.82;
  const mountainHalfWidth = height * 0.50;

  const sunRadius       = height * 0.16;
  const peakY           = height * 0.42;
  const sunCenterY      = peakY - sunRadius * 0.6;
  const mountainHeight  = mountainBaseY - peakY;
  const baseHalfWidth   = mountainHalfWidth + mountainHalfWidth * (height - mountainBaseY) / (mountainBaseY - peakY);
  const craterHalfWidth = mountainHalfWidth * 0.10;
  const craterDepth     = mountainHeight * 0.08;

  strokeWeight(1.5);
  noFill();
  for (let angle = HALF_PI; angle < HALF_PI + TWO_PI; angle += 0.052) {
    const flicker = noise(angle * 0.8, noiseTime * 1.5);
    stroke(232, 77, 28, flicker * 180);
    line(centerX, sunCenterY, centerX + cos(angle) * (sunRadius * 2.0 + flicker * sunRadius * 0.9), sunCenterY + sin(angle) * (sunRadius * 2.0 + flicker * sunRadius * 0.9));
  }
  noStroke();
  for (let ring = 0; ring < 3; ring++) {
    const progress   = (noiseTime * 0.3 + ring / 3) % 1;
    const ringRadius = lerp(sunRadius, sunRadius * 3, progress);
    fill(232, 77, 28, pow(constrain(1 - progress * 3, 0, 1), 3) * 220);
    circle(centerX, sunCenterY, ringRadius * 2);
  }

  const pulse = 1 + 0.06 * (sin(noiseTime * 2) * 0.5 + 0.5);
  fill(232, 77, 28);
  circle(centerX, sunCenterY, sunRadius * 2 * pulse);

  fill(35, 65, 100);
  beginShape();
  vertex(centerX - baseHalfWidth, height);
  vertex(centerX - craterHalfWidth, peakY);
  quadraticVertex(centerX, peakY + craterDepth, centerX + craterHalfWidth, peakY);
  vertex(centerX + baseHalfWidth, height);
  endShape(CLOSE);

  const snowBaseY     = peakY + mountainHeight * 0.28;
  const snowHalfWidth = craterHalfWidth + (baseHalfWidth - craterHalfWidth) * (snowBaseY - peakY) / (height - peakY);
  const rippleAmp     = mountainHeight * 0.040;
  const rippleFreq    = PI * 4 / snowHalfWidth;
  const rippleStep    = snowHalfWidth / 50;

  fill(242, 247, 255);
  beginShape();
  vertex(centerX - craterHalfWidth, peakY);
  quadraticVertex(centerX, peakY + craterDepth, centerX + craterHalfWidth, peakY);
  vertex(centerX + snowHalfWidth, snowBaseY);
  for (let dx = snowHalfWidth; dx >= -snowHalfWidth; dx -= rippleStep) vertex(centerX + dx, snowBaseY + rippleAmp * abs(sin(dx * rippleFreq)));
  vertex(centerX - snowHalfWidth, snowBaseY);
  endShape(CLOSE);

  fill(195, 215, 235, 150);
  beginShape();
  vertex(centerX - craterHalfWidth, peakY);
  quadraticVertex(centerX - craterHalfWidth / 2, peakY + craterDepth / 2, centerX, peakY + craterDepth / 2);
  vertex(centerX, snowBaseY);
  for (let dx = 0; dx >= -snowHalfWidth; dx -= rippleStep) vertex(centerX + dx, snowBaseY + rippleAmp * abs(sin(dx * rippleFreq)));
  vertex(centerX - snowHalfWidth, snowBaseY);
  endShape(CLOSE);
}
