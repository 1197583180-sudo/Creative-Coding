// Interaction mechanic: spacebar intensifies waves; mouse click triggers fish jumps.

// --- Spacebar: wave intensity ---
// waveBoost is extra amplitude added on top of waveAmplitude; it decays each frame.
let waveBoost = 0;

function keyPressed() {
  if (key === ' ') waveBoost = 200;
}

// Call each frame: decay boost toward 0.
function updateWaveBoost() {
  waveBoost *= 0.93;
}

// Used by perlin-mechanic.js: returns the current total amplitude.
function getTotalWaveAmplitude() {
  return waveAmplitude + waveBoost;
}

// --- Mouse click: fish jumps ---
let fishImages = [];   // p5 Image objects, filled after preload.
let fishJumps = [];    // Currently active jump instances.

function preloadFish() {
  for (let i = 1; i <= 4; i++) {
    fishImages.push(loadImage('images/fish' + i + '.svg'));
  }
}

function mousePressed() {
  // Convert screen click coordinates into the 1000×500 design coordinate system used in sketch.js.
  const artworkScale = max(width / artworkWidth, height / artworkHeight);
  const artworkOffsetX = (width - artworkWidth * artworkScale) / 2;
  const artworkOffsetY = (height - artworkHeight * artworkScale) / 2;

  const designX = (mouseX - artworkOffsetX) / artworkScale;
  const designY = (mouseY - artworkOffsetY) / artworkScale + 40; // +40 compensates for the translate(0,-40) in sketch.js

  // Create a jump instance for each of the four fish, slightly staggered horizontally.
  const offsets = [-90, -30, 30, 90];
  offsets.forEach((dx, i) => {
    fishJumps.push({
      img: fishImages[i],
      x: designX + dx,
      waterY: designY,   // Water surface baseline in design coordinates.
      t: 0,              // Animation progress 0 to 1.
      delay: i * 0.08,   // Stagger each fish slightly for a natural feel.
      flipX: dx < 0,     // Fish on the left face left.
    });
  });
}

// Call each frame: update and draw all active fish jumps.
function updateAndDrawFish(deltaSeconds) {
  const speed = 1.0; // Full jump takes ~1 second.

  fishJumps = fishJumps.filter(f => {
    f.t += deltaSeconds * speed;
    if (f.t >= 1 + f.delay) return false; // Animation done, remove.

    const progress = constrain(f.t - f.delay, 0, 1);
    if (progress <= 0) return true; // Still waiting for delay.

    // Parabola: sin(PI * progress) keeps the fish at the surface at 0 and 1, peaking in the middle.
    const jumpHeight = 80;
    const offsetY = -sin(PI * progress) * jumpHeight;

    const fishW = 50;
    const fishH = 30;
    const alpha = progress < 0.1 ? progress * 10 * 255 : progress > 0.9 ? (1 - progress) * 10 * 255 : 255;

    push();
    translate(f.x, f.waterY + offsetY);
    if (f.flipX) scale(-1, 1);
    // multiply blend mode removes white background, keeping only the fish's colored pixels.
    drawingContext.globalCompositeOperation = 'multiply';
    tint(255, alpha);
    image(f.img, -fishW / 2, -fishH / 2, fishW, fishH);
    noTint();
    drawingContext.globalCompositeOperation = 'source-over';
    pop();

    return true;
  });
}
