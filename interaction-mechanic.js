// 交互 mechanic：空格键加剧海浪 + 鼠标点击触发小鱼跳跃。
// Interaction mechanic: spacebar intensifies waves; mouse click triggers fish jumps.

// --- 空格键：海浪强度 ---
// waveBoost 是叠加到 waveAmplitude 上的额外振幅，按帧衰减。
// waveBoost is extra amplitude added on top of waveAmplitude; it decays each frame.
let waveBoost = 0;

function keyPressed() {
  if (key === ' ') waveBoost = 200;
}

// 每帧调用：把 boost 衰减到 0。
// Call each frame: decay boost toward 0.
function updateWaveBoost() {
  waveBoost *= 0.93;
}

// 供 perlin-mechanic.js 使用：返回当前总振幅。
// Used by perlin-mechanic.js: returns the current total amplitude.
function getTotalWaveAmplitude() {
  return waveAmplitude + waveBoost;
}

// --- 鼠标点击：小鱼跳跃 ---
// 每条鱼的状态对象。
// State object for each fish.
let fishImages = [];   // p5 Image 对象，preload 后填入。p5 Image objects, filled after preload.
let fishJumps = [];    // 当前活跃的跳跃实例。Currently active jump instances.

function preloadFish() {
  for (let i = 1; i <= 4; i++) {
    fishImages.push(loadImage('images/fish' + i + '.svg'));
  }
}

function mousePressed() {
  // 把屏幕点击坐标转换到设计坐标系（1000×500，偏移同 sketch.js）。
  // Convert screen click coordinates into the 1000×500 design coordinate system used in sketch.js.
  const artworkScale = max(width / artworkWidth, height / artworkHeight);
  const artworkOffsetX = (width - artworkWidth * artworkScale) / 2;
  const artworkOffsetY = (height - artworkHeight * artworkScale) / 2;

  const designX = (mouseX - artworkOffsetX) / artworkScale;
  const designY = (mouseY - artworkOffsetY) / artworkScale + 40; // +40 补偿 sketch.js 的 translate(0,-40)

  // 为四条鱼各创建一个跳跃实例，水平位置稍微错开。
  // Create a jump instance for each of the four fish, slightly staggered horizontally.
  const offsets = [-90, -30, 30, 90];
  offsets.forEach((dx, i) => {
    fishJumps.push({
      img: fishImages[i],
      x: designX + dx,
      waterY: designY,   // 入水基准线（设计坐标）。Water surface baseline in design coordinates.
      t: 0,              // 动画进度 0→1。Animation progress 0 to 1.
      delay: i * 0.08,   // 每条鱼错开一点，更自然。Stagger each fish slightly for a natural feel.
      flipX: dx < 0,     // 左侧的鱼朝左。Fish on the left face left.
    });
  });
}

// 每帧调用：更新并绘制所有活跃的鱼跳跃。
// Call each frame: update and draw all active fish jumps.
function updateAndDrawFish(deltaSeconds) {
  const speed = 1.0; // 完整跳跃动画耗时约 1 秒。Full jump takes ~1 second.

  fishJumps = fishJumps.filter(f => {
    f.t += deltaSeconds * speed;
    if (f.t >= 1 + f.delay) return false; // 动画结束，移除。Animation done, remove.

    const progress = constrain(f.t - f.delay, 0, 1);
    if (progress <= 0) return true; // 还在等待延迟。Still waiting for delay.

    // 抛物线：sin(PI * progress) 让鱼在 0 和 1 时都在水面，中间跳到顶。
    // Parabola: sin(PI * progress) keeps the fish at the surface at 0 and 1, peaking in the middle.
    const jumpHeight = 80;
    const offsetY = -sin(PI * progress) * jumpHeight;

    // 鱼的尺寸和透明度。
    const fishW = 50;
    const fishH = 30;
    const alpha = progress < 0.1 ? progress * 10 * 255 : progress > 0.9 ? (1 - progress) * 10 * 255 : 255;

    push();
    translate(f.x, f.waterY + offsetY);
    if (f.flipX) scale(-1, 1);
    // multiply 混合模式让白色背景消失，只保留鱼身上的彩色像素。
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
