function setup() {
  setupArtworkBase();
}

function draw() {
  drawBackgroundGradient();

  const deltaSeconds = updateMechanicTime();
  updatePerlinWaveLines(noiseTime);
  updateTimeDrivenBackgroundLines(deltaSeconds, noiseTime);

  drawMountainAndSun();

  const artworkScale   = max(width / artworkWidth, height / artworkHeight);
  const artworkOffsetX = (width  - artworkWidth  * artworkScale) / 2;
  const artworkOffsetY = (height - artworkHeight * artworkScale) / 2;

  push();
  translate(artworkOffsetX, artworkOffsetY);
  scale(artworkScale);
  translate(0, -40);

  drawTimeDrivenBoat(800, 370, 130, -1);

  for (const backgroundLine of backgroundLines) {
    for (let i = 0; i < backgroundLine.history.length; i++) {
      drawBackgroundWaveBand(backgroundLine.baseY + backgroundLine.history[i].offset, backgroundLine.timeOffset, 255 * i / max(1, backgroundLine.history.length - 1), backgroundLine.colorKeys, backgroundLine.history[i].time);
    }
    drawBackgroundWaveBand(backgroundLine.baseY + backgroundLine.offset, backgroundLine.timeOffset, 255, backgroundLine.colorKeys, noiseTime);
  }

  const drawWaveLine = (waveLine) => {
    for (let i = 0; i < waveLine.history.length; i++) {
      drawWaveLineLayers(waveLine.baseY + waveLine.history[i].offset, waveLine.timeOffset, 255 * i / max(1, waveLine.history.length - 1), waveLine.colorKeys, waveLine.history[i].time);
    }
    drawWaveLineLayers(waveLine.baseY + waveLine.offset, waveLine.timeOffset, 255, waveLine.colorKeys, noiseTime);
  };

  for (let i = 0; i < 3; i++) drawWaveLine(waveLines[i]);

  drawTimeDrivenBoat(650, 400, 260);

  for (let i = 3; i < waveLines.length; i++) drawWaveLine(waveLines[i]);

  pop();
}
