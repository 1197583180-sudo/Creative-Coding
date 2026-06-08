function preload() {
  preloadAudio();
}

function setup() {
  // p5 会在页面加载后自动调用 setup。这里依次完成画布基础初始化和各 mechanic 的数据准备。
  // p5 automatically calls setup after the page loads. This sets up the canvas base, then prepares each mechanic's data.
  setupArtworkBase();
  setupWaveColors();
  setupAudioMechanic();
}

function draw() {
  // p5 每一帧都会调用 draw。这里负责组织所有绘制和 mechanic 更新的顺序。
  // p5 calls draw every frame. This function coordinates all drawing and mechanic update order.

  // 每帧先重画背景，避免上一帧的图像残留。
  // Redraw the background first each frame to prevent previous-frame artifacts.

  updateAudioMechanic();
  drawBackgroundGradient();

  // 更新时间，并把同一份时间传给 time-based 和 Perlin mechanic。
  // Update time, then pass the same timing values to the time-based and Perlin mechanics.
  const deltaSeconds = updateMechanicTime();
  updatePerlinWaveLines(noiseTime);
  updateTimeDrivenBackgroundLines(deltaSeconds, noiseTime);

  // 山和太阳先画，后面的海浪会盖在它们前面，形成远近层次。
  // Draw the mountain and sun first, so later waves appear in front and create depth.
  drawMountainAndSun();

  // 计算作品相对于当前窗口的缩放和居中偏移。
  // Calculate the artwork scale and centering offset for the current window.
  const artworkScale = max(width / artworkWidth, height / artworkHeight);
  const artworkOffsetX = (width - artworkWidth * artworkScale) / 2;
  const artworkOffsetY = (height - artworkHeight * artworkScale) / 2;

  push();

  // 把后续所有海浪和船的绘制转换到 1000 x 500 的设计坐标系里。
  // Transform all following wave and boat drawing into the 1000 x 500 design coordinate system.
  translate(artworkOffsetX, artworkOffsetY);
  scale(artworkScale);

  // 整体向上移动一点，让主要海浪在画面中更突出。
  // Move the artwork slightly upward so the main waves are more prominent.
  translate(0, -40);

  // 先画远处小船，因此它会被后续海浪部分遮挡。
  // Draw the distant small boat first, so later waves can partially cover it.
  drawTimeDrivenBoat(800, 370, 130, -1);

  // 绘制背景浪，包括它的历史拖影和当前状态。
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
    // 先按历史记录重画旧状态，透明度从低到高，形成拖影。
    // First redraw older states from history with increasing alpha to create a trail.
    for (let i = 0; i < waveLine.history.length; i++) {
      const alpha = 255 * i / max(1, waveLine.history.length - 1);
      const historyY = waveLine.baseY + waveLine.history[i].offset;
      drawWaveLineLayers(historyY, waveLine.timeOffset, alpha, waveLine.colorKeys, waveLine.history[i].time);
    }

    // 最后画当前状态，透明度最高，所以当前海浪最清晰。
    // Finally draw the current state at full opacity, making the current wave the clearest.
    drawWaveLineLayers(waveLine.baseY + waveLine.offset, waveLine.timeOffset, 255, waveLine.colorKeys, noiseTime);
  };

  // 先画前三条浪，作为大船后方的海面。
  // Draw the first three waves first, placing them behind the large boat.
  for (let i = 0; i < 3; i++) drawWaveLine(waveLines[i]);

  // 再画大船，让它位于部分海浪之间。
  // Draw the large boat next, placing it between wave layers.
  drawTimeDrivenBoat(650, 400, 260, 1, 1.6);

  // 最后画剩下的浪，让它们覆盖在大船前方，制造遮挡层次。
  // Draw the remaining waves last, so they cover the front of the large boat and create occlusion depth.
  for (let i = 3; i < waveLines.length; i++) drawWaveLine(waveLines[i]);

  pop();
}

function mousePressed() {
  startAudioMechanic();
}