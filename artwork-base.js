let waveColors;

const artworkWidth  = 1000;
const artworkHeight = 500;

function setupArtworkBase() {
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

function drawBackgroundGradient() {
  const gradient = drawingContext.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0,    '#F0E2C0');
  gradient.addColorStop(0.50, '#F0E2C0');
  gradient.addColorStop(1,    '#0A7BC4');
  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0, 0, width, height);
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

  drawPerlinSunRays(centerX, sunCenterY, sunRadius, noiseTime);
  drawTimeDrivenSunRings(centerX, sunCenterY, sunRadius);
  drawTimeDrivenSunPulse(centerX, sunCenterY, sunRadius);

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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
