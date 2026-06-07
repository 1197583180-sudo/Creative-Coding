/*
  Foreground wave layer.

  Starts as a quiet rolling swell, not a finished crashing wave. Later
  mechanics can increase height, curl, foam, and sparkle from this base.
*/

function drawMainWaveLayer() {
  const h = state.waveHeight;
  const curl = state.waveCurl;
  const crash = state.crashAmount;

  drawForegroundSwell(h, curl);
  drawSmallFoamRidges(crash);
}

function drawForegroundSwell(h, curl) {
  push();

  const crestLift = map(h, 0.75, 1.35, 18, -34, true);
  const curlPush = (curl - 1) * 34;

  noStroke();
  fill("#155d82");
  beginShape();
  vertex(0, 665);
  bezierVertex(150, 620 + crestLift, 275, 660, 430, 625 + crestLift);
  bezierVertex(600, 585 + crestLift, 780 + curlPush, 640, 940, 610 + crestLift);
  bezierVertex(1045, 592, 1130, 615, 1200, 598);
  vertex(1200, 760);
  vertex(0, 760);
  endShape(CLOSE);

  fill("#0f4d73");
  beginShape();
  vertex(0, 705);
  bezierVertex(210, 660, 355, 712, 540, 680);
  bezierVertex(760, 640, 970, 694, 1200, 658);
  vertex(1200, 760);
  vertex(0, 760);
  endShape(CLOSE);

  stroke(palette.ink);
  strokeWeight(2.2);
  noFill();
  beginShape();
  vertex(0, 665);
  bezierVertex(150, 620 + crestLift, 275, 660, 430, 625 + crestLift);
  bezierVertex(600, 585 + crestLift, 780 + curlPush, 640, 940, 610 + crestLift);
  bezierVertex(1045, 592, 1130, 615, 1200, 598);
  endShape();

  pop();
}

function drawSmallFoamRidges(crash) {
  const foam = state.layers.foam;
  const ridgeCount = floor(10 + crash * 18);

  push();
  strokeCap(ROUND);
  noFill();

  randomSeed(33);
  for (let i = 0; i < ridgeCount; i++) {
    const x = 80 + i * 108 + random(-18, 18);
    const y = 612 + sin(i * 0.9) * 26 + random(-8, 8);
    const w = random(46, 98) * foam.scale;

    stroke(247, 244, 231, 122 + crash * 80);
    strokeWeight(random(1.6, 3.4));
    arc(x, y, w, random(14, 25), 185, 355);
  }

  pop();
}

function drawFoamCurls() {
  // Kept as a named hook for future crashing-wave mechanics.
}
