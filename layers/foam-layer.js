/*
  Foreground foam layer.

  A light optional foam/sparkle layer. It starts restrained and can be amplified
  by randomness, audio, or input later.
*/

function drawFoamLayer() {
  const foam = state.layers.foam;

  push();

  fill(250, 247, 230, 92);
  stroke(247, 244, 231, 130);
  strokeWeight(1.6);

  randomSeed(21);
  const foregroundCount = floor(8 * foam.amount);
  for (let i = 0; i < foregroundCount; i++) {
    const x = 120 + i * 128 + random(-18, 18);
    const y = 650 + sin(i * 0.7) * 22 + random(-6, 6);
    arc(x, y, random(48, 82), random(12, 22), 185, 355);
  }

  noStroke();
  fill(255, 250, 224, 46);
  for (let i = 0; i < 20; i++) {
    ellipse(90 + i * 54, 600 + sin(i * 1.3) * 48, 22, 4);
  }

  pop();
}
