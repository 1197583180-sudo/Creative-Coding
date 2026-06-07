/*
  Sea layer.

  A calm, structured ocean surface for later animation. The layer uses depth
  bands, perspective wavelets, and a coherent reflection path instead of loose
  decorative curves.
*/

function drawSeaLayer() {
  const sea = state.layers.sea;

  drawSeaHorizonWash(sea);
  drawSeaDepthBands(sea);
  drawSeaReflectionPath(sea);
  drawSeaPerspectiveRipples(sea);
  drawSeaNearSurfaceLines(sea);
}

function drawSeaHorizonWash(sea) {
  noStroke();

  fill("#b7d6d0");
  beginShape();
  vertex(0, 444);
  bezierVertex(220, 436 + sea.swell * 0.2, 430, 448, 620, 442 + sea.swell * 0.2);
  bezierVertex(820, 436, 1000, 448, 1200, 440);
  vertex(1200, 760);
  vertex(0, 760);
  endShape(CLOSE);

  fill(238, 231, 202, 42);
  rect(0, 444, designW, 44);
}

function drawSeaDepthBands(sea) {
  const bands = [
    { y: 474, color: "#9cc8c8", alpha: 220, lift: 0.25 },
    { y: 526, color: "#73adbc", alpha: 230, lift: 0.55 },
    { y: 590, color: "#3d86a6", alpha: 235, lift: 0.9 },
    { y: 666, color: "#1f628a", alpha: 245, lift: 1.2 }
  ];

  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];
    const nextY = i === bands.length - 1 ? 760 : bands[i + 1].y + 18;
    const lift = sea.swell * band.lift;

    noStroke();
    fill(colorWithAlpha(band.color, band.alpha));
    beginShape();
    vertex(0, band.y + lift);
    bezierVertex(210, band.y - 8 + lift, 390, band.y + 10 + lift, 610, band.y - 2 + lift);
    bezierVertex(830, band.y - 14 + lift, 1010, band.y + 10 + lift, 1200, band.y - 4 + lift);
    vertex(1200, nextY);
    vertex(0, nextY);
    endShape(CLOSE);
  }
}

function drawSeaReflectionPath(sea) {
  const strength = sea.reflectionStrength;
  if (strength <= 0) return;

  push();
  translate(sea.reflectionDrift + sea.stripeFlow * 0.25, 0);
  noStroke();

  for (let i = 0; i < 26; i++) {
    const t = i / 25;
    const y = lerp(462, 680, t);
    const centerX = 610 + sin(t * PI * 2.2) * lerp(6, 34, t);
    const w = lerp(38, 168, t) * (0.72 + 0.18 * sin(i * 1.7));
    const h = lerp(3, 8, t);
    const alpha = lerp(80, 34, t) * strength;

    fill(255, 246, 205, alpha);
    ellipse(centerX, y, w, h);
  }

  for (let i = 0; i < 13; i++) {
    const t = i / 12;
    const y = lerp(496, 628, t);
    const spread = lerp(42, 118, t);

    fill(244, 238, 210, 26 * strength);
    ellipse(610 - spread * 0.5, y, 48 + t * 54, 4);
    ellipse(610 + spread * 0.55, y + 6, 52 + t * 48, 4);
  }

  pop();
}

function drawSeaPerspectiveRipples(sea) {
  strokeCap(ROUND);
  noFill();

  const rowCount = 17;
  for (let row = 0; row < rowCount; row++) {
    const t = row / (rowCount - 1);
    const y = lerp(462, 692, t);
    const spacing = lerp(96, 176, t);
    const amp = lerp(1.2, 7.5, t) + sea.swell * lerp(0.01, 0.05, t);
    const alpha = lerp(72, 132, t);
    const weight = lerp(0.7, 1.7, t);
    const flow = sea.stripeFlow * lerp(0.18, 1, t);

    stroke(22, 73, 101, alpha);
    strokeWeight(weight);

    for (let x = -spacing; x < designW + spacing; x += spacing) {
      const phase = (row % 2) * spacing * 0.45;
      const startX = x + phase + flow;
      const endX = startX + spacing * lerp(0.46, 0.72, t);

      drawRippleSegment(startX, y, endX, amp);
    }
  }
}

function drawSeaNearSurfaceLines(sea) {
  strokeCap(ROUND);
  noFill();

  for (let row = 0; row < 5; row++) {
    const y = 646 + row * 22 + sea.swell * 0.5;
    const amp = 6 + row * 1.2;
    const spacing = 210 + row * 18;
    const flow = sea.stripeFlow * 1.2;

    stroke(238, 244, 230, 38 - row * 3);
    strokeWeight(2.2 - row * 0.15);

    for (let x = -220; x < designW + 240; x += spacing) {
      drawRippleSegment(x + flow + row * 54, y, x + flow + row * 54 + spacing * 0.62, amp);
    }
  }
}

function drawRippleSegment(x1, y, x2, amp) {
  beginShape();
  vertex(x1, y);
  bezierVertex(
    lerp(x1, x2, 0.28),
    y - amp,
    lerp(x1, x2, 0.72),
    y + amp,
    x2,
    y
  );
  endShape();
}

function colorWithAlpha(hexColor, alpha) {
  const c = color(hexColor);
  return color(red(c), green(c), blue(c), alpha);
}
