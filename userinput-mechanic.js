// Interaction mechanic: spacebar intensifies waves; mouse click triggers fish jumps.

// --- Spacebar: wave intensity ---
// userInputWaveBoost is extra amplitude added on top of baseWaveAmplitude; it decays each frame.
let userInputWaveBoost = 0;

function keyPressed() {
  if (key === ' ') userInputWaveBoost = 200;
}

// Call each frame: decay boost toward 0.
function updateWaveBoost() {
  userInputWaveBoost *= 0.93;
}

// Used by perlin-mechanic.js: returns the current total amplitude.
function getTotalWaveAmplitude() {
  return baseWaveAmplitude + userInputWaveBoost;
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
  // If the audio button was clicked, toggle audio and skip everything else.
  if (isAudioButtonClick(mouseX, mouseY)) {
    toggleAudioMechanic();
    return;
  }

  // Convert screen click coordinates into the 1000×500 design coordinate system used in sketch.js.
  const artworkScale = max(width / artworkWidth, height / artworkHeight);
  const artworkOffsetY = (height - artworkHeight * artworkScale) / 2;

  const designY = (mouseY - artworkOffsetY) / artworkScale + 40; // +40 compensates for the translate(0,-40) in sketch.js

  // Only spawn fish when the click lands in the ocean area (y 340–500 in design coordinates).
  if (designY >= 340 && designY <= 500) {
    for (let i = 0; i < fishImages.length; i++) {
      fishJumps.push({
        img: fishImages[i],
        x: random(0, artworkWidth),   // Random x anywhere across the canvas.
        waterY: random(340, 500),     // Random y within the ocean area.
        t: 0,
        delay: i * 0.08,              // Staggered timing kept for natural feel.
        flipX: random() > 0.5,        // Random facing direction.
      });
    }
  }
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
