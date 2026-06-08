function preload() {
  preloadFish();
}

function setup() {
  // p5 automatically calls setup after the page loads. The base initialization is handled in artwork-base.js.
  setupArtworkBase();
}

function draw() {
  // p5 calls draw every frame. This function coordinates all drawing and mechanic update order.

  // Redraw the background first each frame to prevent previous-frame artifacts.
  drawBackgroundGradient();

  // Update time, then pass the same timing values to the time-based and Perlin mechanics.
  const deltaSeconds = updateMechanicTime();
  updateWaveBoost();
  updatePerlinWaveLines(noiseTime);
  updateTimeDrivenBackgroundLines(deltaSeconds, noiseTime);

  // Draw the mountain and sun first, so later waves appear in front and create depth.
  drawMountainAndSun();

  // Calculate the artwork scale and centering offset for the current window.
  const artworkScale = max(width / artworkWidth, height / artworkHeight);
  const artworkOffsetX = (width - artworkWidth * artworkScale) / 2;
  const artworkOffsetY = (height - artworkHeight * artworkScale) / 2;

  push();

  // Transform all following wave and boat drawing into the 1000 x 500 design coordinate system.
  translate(artworkOffsetX, artworkOffsetY);
  scale(artworkScale);

  // Move the artwork slightly upward so the main waves are more prominent.
  translate(0, -40);

  // Draw the distant small boat first, so later waves can partially cover it.
  drawTimeDrivenBoat(800, 370, 130, -1);

  // Draw the background wave, including its historical trail and current state.
  for (const backgroundLine of backgroundLines) {
    for (let i = 0; i < backgroundLine.history.length; i++) {
      const alpha = 255 * i / max(1, backgroundLine.history.length - 1);
      const historyY = backgroundLine.baseY + backgroundLine.history[i].offset;
      drawBackgroundWaveBand(historyY, backgroundLine.timeOffset, alpha, backgroundLine.colorKeys, backgroundLine.history[i].time);
    }

    drawBackgroundWaveBand(backgroundLine.baseY + backgroundLine.offset, backgroundLine.timeOffset, 255, backgroundLine.colorKeys, noiseTime);
  }

  const drawWaveLine = (waveLine) => {
    // First redraw older states from history with increasing alpha to create a trail.
    for (let i = 0; i < waveLine.history.length; i++) {
      const alpha = 255 * i / max(1, waveLine.history.length - 1);
      const historyY = waveLine.baseY + waveLine.history[i].offset;
      drawWaveLineLayers(historyY, waveLine.timeOffset, alpha, waveLine.colorKeys, waveLine.history[i].time);
    }

    // Finally draw the current state at full opacity, making the current wave the clearest.
    drawWaveLineLayers(waveLine.baseY + waveLine.offset, waveLine.timeOffset, 255, waveLine.colorKeys, noiseTime);
  };

  // Draw the first three waves first, placing them behind the large boat.
  for (let i = 0; i < 3; i++) drawWaveLine(waveLines[i]);

  // Draw the large boat next, placing it between wave layers.
  drawTimeDrivenBoat(650, 400, 260);

  // Draw the remaining waves last, so they cover the front of the large boat and create occlusion depth.
  for (let i = 3; i < waveLines.length; i++) drawWaveLine(waveLines[i]);

  // Draw jumping fish on top of everything else.
  updateAndDrawFish(deltaSeconds);

  pop();
}
