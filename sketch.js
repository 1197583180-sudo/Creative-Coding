/*
  Breathing Wave - Base Artwork
  Reinterpretation of Hokusai's The Great Wave off Kanagawa.

  This file only sets up the canvas and calls the modular drawing/mechanic
  functions. Each mechanic should live in its own separate file.
*/

let canvasScale = 1;
let designW = 1200;
let designH = 760;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");

  pixelDensity(1);
  noLoop();

  // Initial setup hooks for later mechanic files
  setupTimeMechanic();
  setupInputMechanic();
  setupAudioMechanic();
  setupPerlinMechanic();
}

function draw() {
  clear();

  // Update mechanic values first
  updateTimeMechanic();
  updateInputMechanic();
  updateAudioMechanic();
  updatePerlinMechanic();

  // Draw the artwork after mechanics update the shared state
  drawArtworkBase();

  if (state.showDebug) drawDebugPanel();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

// Convert the original artwork coordinate system to responsive screen size.
function beginArtworkTransform() {
  const scaleX = width / designW;
  const scaleY = height / designH;
  canvasScale = min(scaleX, scaleY);

  const offsetX = (width - designW * canvasScale) / 2;
  const offsetY = (height - designH * canvasScale) / 2;

  push();
  translate(offsetX, offsetY);
  scale(canvasScale);
}

function endArtworkTransform() {
  pop();
}

function drawDebugPanel() {
  push();
  fill(0, 170);
  noStroke();
  rect(16, 16, 280, 120, 8);
  fill(255);
  textSize(13);
  text("Shared State", 32, 42);
  text("waveHeight: " + nf(state.waveHeight, 1, 2), 32, 66);
  text("waveCurl: " + nf(state.waveCurl, 1, 2), 32, 86);
  text("crashAmount: " + nf(state.crashAmount, 1, 2), 32, 106);
  text("noiseStrength: " + nf(state.noiseStrength, 1, 2), 32, 126);
  pop();
}

function keyPressed() {
  if (key === "d" || key === "D") {
    state.showDebug = !state.showDebug;
    redraw();
  }
}
