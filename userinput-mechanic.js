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

// Natural facing direction of each fish SVG (index 0=fish1 … 3=fish4).
// true = SVG points right by default, false = SVG points left by default.
// If a specific fish still jumps backwards, flip its value here.
const fishFacesRight = [true, true, true, true];

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
      const direction = random() > 0.5 ? 1 : -1;
      // Flip only when direction is opposite to the fish's natural facing in the SVG.
      const flipX = fishFacesRight[i] ? direction < 0 : direction > 0;
      fishJumps.push({
        img: fishImages[i],
        x: random(0, artworkWidth),
        waterY: random(340, 500),
        t: 0,
        delay: i * 0.08,
        flipX,
        forwardDist: random(40, 90) * direction,
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

    const jumpHeight = 80;
    const offsetY = -sin(PI * progress) * jumpHeight;
    const offsetX = progress * f.forwardDist; // moves forward in the direction the fish faces

    const fishW = 50;
    const fishH = 30;
    const alpha = progress < 0.1 ? progress * 10 * 255 : progress > 0.9 ? (1 - progress) * 10 * 255 : 255;

    push();
    translate(f.x + offsetX, f.waterY + offsetY);
    if (f.flipX) scale(-1, 1);
    // Warm halo drawn first (normal blend) so multiply on the fish turns white areas golden.
    noStroke();
    fill(255, 255, 255, alpha);
    ellipse(0, 0, fishW * 0.15, fishH * 0.15);
    // multiply blend mode removes white background; white areas pick up the golden halo colour.
    drawingContext.globalCompositeOperation = 'multiply';
    tint(255, alpha);
    image(f.img, -fishW / 2, -fishH / 2, fishW, fishH);
    noTint();
    drawingContext.globalCompositeOperation = 'source-over';
    pop();

    return true;
  });
}
