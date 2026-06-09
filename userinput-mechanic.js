// Interaction mechanic: spacebar intensifies waves; mouse click triggers fish jumps.
// AI-assisted: this file was developed with the help of Claude Code (claude-sonnet-4-6, Anthropic).
// AI assistance was used for the parabolic fish arc, lerp-based wave boost decay, and SVG blend mode rendering.

// --- Spacebar: wave intensity ---
// userInputWaveBoost is extra amplitude added on top of baseWaveAmplitude; it decays each frame.
let waveBoostTarget  = 0;  // set to 1.0 on spacebar, then decays
let waveBoostCurrent = 0;  // smoothly follows target via lerp

function keyPressed() {
  if (key === ' ') waveBoostTarget = 1.0;
}

// Same approach as audio mechanic: multiply waveHeightMultiplier (already set by audio this
// frame) so perlin reads the boosted value. Lerp gives smooth rise; target decay gives smooth fall.
function updateWaveBoost() {
  waveBoostCurrent = lerp(waveBoostCurrent, waveBoostTarget, 0.12);
  waveBoostTarget  *= 0.96;
  if (waveBoostTarget < 0.001) waveBoostTarget = 0;

  if (waveBoostCurrent > 0.001) {
    waveHeightMultiplier *= (1 - waveBoostCurrent * 1.0);
  }
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
  if (designY >= 340 && designY <= 600) {
    for (let i = 0; i < fishImages.length; i++) {
      const direction = random() > 0.5 ? 1 : -1;
      // Flip only when direction is opposite to the fish's natural facing in the SVG.
      const flipX = fishFacesRight[i] ? direction < 0 : direction > 0;
      fishJumps.push({
        img: fishImages[i],
        x: random(0, artworkWidth),
        waterY: random(340, 600),
        t: 0,
        delay: i * 0.08,
        flipX,
        forwardDist: random(40, 90) * direction,
        playedSplash: false,
        splashIndex: floor(random(splashSounds.length)),
        fishScale: map(
          random(340, 500),
          340,
          500,
          0.7,
          1.3
        )
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
    if (progress <= 0) return true;
    // Fish leaves water -> play splash once
    if (
      !f.playedSplash &&
      progress > 0.05 &&
      audioPlaying
    ) {
      
      f.playedSplash = true;
      const splash = splashSounds[f.splashIndex];
      if (splash && splash.isLoaded()) {
        // deeper fish = louder splash
        const volume = map(
          f.waterY,
          340,
          500,
          0.35,
          1.0,
          true
        );
        
        splash.setVolume(volume);
        splash.play();
      }
    }

    const jumpHeight = map(
      f.waterY,
      340,
      500,
      55,
      100,
      true
    );

    const offsetY = -sin(PI * progress) * jumpHeight;
    const offsetX = progress * f.forwardDist; // moves forward in the direction the fish faces

    const fishW = 50 * f.fishScale;
    const fishH = 30 * f.fishScale;
    const alpha = progress < 0.1 ? progress * 10 * 255 : progress > 0.9 ? (1 - progress) * 10 * 255 : 255;

    push();
    translate(f.x + offsetX, f.waterY + offsetY);
    if (f.flipX) scale(-1, 1);
    // Warm halo drawn first (normal blend) so multiply on the fish turns white areas golden.
    noStroke();
    fill(255, 255, 255, alpha);
    ellipse(0, 0, fishW * 0.15, fishH * 0.15);
    // drawingContext.globalCompositeOperation is a Canvas 2D API property (not standard p5.js).
    // 'multiply' blends pixel colours by multiplying them: white (255) × any colour = that colour,
    // so the SVG's white background disappears and only the fish linework remains.
    // Source: MDN Web Docs — CanvasRenderingContext2D: globalCompositeOperation property
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    drawingContext.globalCompositeOperation = 'multiply';
    tint(255, alpha);
    image(f.img, -fishW / 2, -fishH / 2, fishW, fishH);
    noTint();
    drawingContext.globalCompositeOperation = 'source-over';
    pop();

    return true;
  });
}
