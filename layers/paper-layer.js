/*
  Paper layer.

  Establishes the print surface: warm paper, grain, and a subtle border.
*/

function drawPaperLayer() {
  const paper = state.layers.paper;

  background(palette.paper);

  noStroke();
  randomSeed(12);
  const grainCount = floor(900 * paper.grainDensity);
  for (let i = 0; i < grainCount; i++) {
    const x = random(designW);
    const y = random(designH);
    const s = random(0.5, 2.2);
    fill(120, 95, 55, random(6, 18) * paper.grainAlpha);
    circle(x, y, s);
  }

  for (let i = 0; i < 18; i++) {
    noFill();
    stroke(90, 70, 40, 8 * paper.vignette);
    rect(i * 3, i * 3, designW - i * 6, designH - i * 6);
  }
}
