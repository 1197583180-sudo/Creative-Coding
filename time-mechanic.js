let noiseTime = 0;

const backgroundLines = [
  { dir: 1, speed: 12, baseY: 300, timeOffset: 5.5, y: 300, colorKeys: ['darkNavy', 'darkNavy'], history: [] },
];

const backgroundTrailLength = 23;

function updateMechanicTime() {
  const deltaSeconds = min(deltaTime, 50) / 1000;
  noiseTime += deltaSeconds * 0.36;
  return deltaSeconds;
}

function updateTimeDrivenBackgroundLines(deltaSeconds, currentTime) {
  for (const backgroundLine of backgroundLines) {
    backgroundLine.y += backgroundLine.dir * backgroundLine.speed * deltaSeconds;
    if (backgroundLine.y >= 300) { backgroundLine.y = 300; backgroundLine.dir = -1; }
    if (backgroundLine.y <= 290) { backgroundLine.y = 290; backgroundLine.dir =  1; }
    backgroundLine.offset = backgroundLine.y - backgroundLine.baseY;
    backgroundLine.history.push({ offset: backgroundLine.offset, time: currentTime });
    if (backgroundLine.history.length > backgroundTrailLength) backgroundLine.history.shift();
  }
}

function drawTimeDrivenBoat(baseX, baseY, boatWidth, direction = 1) {
  const boatPhase = noiseTime * 2;
  push();
  translate(baseX + cos(boatPhase * 0.5) * 55 * direction, baseY + sin(boatPhase) * 18 * direction);
  rotate(sin(boatPhase) * radians(5) * direction);
  drawBoat(0, 0, boatWidth);
  pop();
}

function drawTimeDrivenSunRings(centerX, sunCenterY, sunRadius) {
  noStroke();
  for (let ring = 0; ring < 3; ring++) {
    const progress   = (noiseTime * 0.3 + ring / 3) % 1;
    const ringRadius = lerp(sunRadius, sunRadius * 3, progress);
    fill(232, 77, 28, pow(constrain(1 - progress * 3, 0, 1), 3) * 220);
    circle(centerX, sunCenterY, ringRadius * 2);
  }
}

function drawTimeDrivenSunPulse(centerX, sunCenterY, sunRadius) {
  const pulse = 1 + 0.06 * (sin(noiseTime * 2) * 0.5 + 0.5);
  fill(232, 77, 28);
  circle(centerX, sunCenterY, sunRadius * 2 * pulse);
}
