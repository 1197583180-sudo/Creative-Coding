// 存放整件作品会重复使用的颜色。
// Stores reusable colors for the whole artwork.
let waveColors;

// 作品的设计基准尺寸。窗口缩放时会以这个尺寸为基础等比例放大。
// Base design size of the artwork. The canvas scales from this size when the window changes.
const artworkWidth = 1000;
const artworkHeight = 500;

function setupArtworkBase() {
  // 创建与浏览器窗口同尺寸的 p5 画布。
  // Create a p5 canvas with the same size as the browser window.
  createCanvas(windowWidth, windowHeight);

  // 使用当前屏幕像素密度，让 Retina 等高分辨率屏幕显示更清晰。
  // Use the current display density so high-resolution screens, such as Retina displays, look sharper.
  pixelDensity(displayDensity());

  // 设置目标帧率为 45 FPS，平衡流畅度和性能。
  // Set the target frame rate to 45 FPS, balancing smoothness and performance.
  frameRate(45);

  // 给海浪准备一组命名颜色，其他文件可以通过 colorKeys 引用它们。
  // Prepare named wave colors so other files can reference them through colorKeys.
  waveColors = {
    darkNavy : color('#021036'),
    prussian : color('#0B409C'),
    cobalt   : color('#0A7BC4'),
    blue     : color('#10B4E0'),
    skyBlue  : color('#48CCE8'),
  };
}

function drawBackgroundGradient() {
  // 使用 canvas 原生 drawingContext 创建垂直渐变，比逐行画矩形更直接。
  // Use the native canvas drawingContext to create a vertical gradient more directly than drawing many rectangles.
  const gradient = drawingContext.createLinearGradient(0, 0, 0, height);

  // 上半部分保持暖色，底部过渡到蓝色，形成天空到海面的感觉。
  // Keep the upper half warm and transition to blue at the bottom, suggesting sky blending into sea.
  gradient.addColorStop(0, '#F0E2C0');
  gradient.addColorStop(0.50, '#F0E2C0');
  gradient.addColorStop(1, '#0A7BC4');

  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0, 0, width, height);
}

function drawBoat(x, y, boatWidth) {
  // 船的所有尺寸都从 boatWidth 推导，这样大船小船可以共用同一个函数。
  // All boat dimensions are derived from boatWidth, so large and small boats can share this function.
  const boatHeight = boatWidth * 0.24;
  const left = x - boatWidth / 2;
  const right = x + boatWidth / 2;
  const tipY = y - boatHeight * 0.12;
  const bottomLeftX = left + boatWidth * 0.18;
  const bottomRightX = right - boatWidth * 0.18;
  const bottomY = y + boatHeight * 0.55;

  const drawHull = () => {
    // cornerCut 控制船身两侧收进去的程度。
    // cornerCut controls how much the hull corners are pulled inward.
    const cornerCut = 0.28;

    beginShape();
    vertex(left, tipY);
    vertex(lerp(left, bottomLeftX, 1 - cornerCut), lerp(tipY, bottomY, 1 - cornerCut));

    // quadraticVertex 画弯曲船底，让船身不像硬折线。
    // quadraticVertex draws a curved hull bottom so the boat does not look like hard straight segments.
    quadraticVertex(bottomLeftX, bottomY, lerp(bottomLeftX, bottomRightX, cornerCut), bottomY);
    vertex(lerp(bottomLeftX, bottomRightX, 1 - cornerCut), bottomY);
    quadraticVertex(bottomRightX, bottomY, lerp(bottomRightX, right, cornerCut), lerp(bottomY, tipY, cornerCut));
    vertex(right, tipY);
    quadraticVertex(x, y + boatHeight * 0.18, left, tipY);
    endShape(CLOSE);
  };

  noStroke();

  // 船身基础木色。
  // Base wood color for the hull.
  const hullBaseColor = color('#B98A55');

  // 根据 steps 生成更暗的木色，用于画出船身层次。
  // Generate darker wood colors from steps to create layered shading on the hull.
  const shadeOf = (steps) => lerpColor(hullBaseColor, color(0), steps * 0.18);

  const bandEdgesAt = (t) => ({
    // t 是从船顶到底部的比例，用来找某条横向木板分界线的位置。
    // t is the proportion from the hull top to bottom, used to locate a horizontal plank boundary.
    bandY: lerp(tipY, bottomY, t),
    leftX: lerp(left, bottomLeftX, t),
    rightX: lerp(right, bottomRightX, t),
  });

  const fillAboveBand = ({ bandY, leftX, rightX }) => {
    // 只填充分界线以上的船身区域，用多次覆盖形成明暗层。
    // Fill only the area above a boundary line; repeated overlays create light and dark layers.
    beginShape();
    vertex(left, tipY);
    vertex(leftX, bandY);
    quadraticVertex(x, bandY + boatHeight * 0.08, rightX, bandY);
    vertex(right, tipY);
    quadraticVertex(x, y + boatHeight * 0.18, left, tipY);
    endShape(CLOSE);
  };

  // 从深到浅依次覆盖，形成木船的体积感。
  // Paint from darker to lighter overlays to give the wooden boat volume.
  fill(shadeOf(3));
  drawHull();

  fill(shadeOf(2));
  fillAboveBand(bandEdgesAt(3 / 4));

  fill(shadeOf(1));
  fillAboveBand(bandEdgesAt(2 / 4));

  fill(shadeOf(0));
  fillAboveBand(bandEdgesAt(1 / 4));

  // 最后加描边，明确船的轮廓。
  // Add the final outline to clarify the boat shape.
  stroke('#5E3F22');
  strokeWeight(0.5);
  noFill();
  drawHull();
}

function drawMountainAndSun() {
  // 山和太阳放在画面右侧，作为远景。
  // The mountain and sun are placed on the right side as background scenery.
  const centerX = width * 0.75;
  const mountainBaseY = height * 0.82;
  const mountainHalfWidth = height * 0.50;

  // 这些变量共同决定太阳位置、山顶位置和山体比例。
  // These variables define the sun position, mountain peak, and mountain proportions.
  const sunRadius = height * 0.16;
  const peakY = height * 0.42;
  const sunCenterY = peakY - sunRadius * 0.6;
  const mountainHeight = mountainBaseY - peakY;
  const baseHalfWidth = mountainHalfWidth + mountainHalfWidth * (height - mountainBaseY) / (mountainBaseY - peakY);
  const craterHalfWidth = mountainHalfWidth * 0.10;
  const craterDepth = mountainHeight * 0.08;

  // 太阳由两个 mechanics 共同驱动：Perlin noise 负责光芒闪烁，Time-based 负责光环和脉冲。
  // The sun is driven by two mechanics: Perlin noise controls ray flicker, and time-based logic controls rings and pulse.
  drawPerlinSunRays(centerX, sunCenterY, sunRadius, noiseTime);
  drawTimeDrivenSunRings(centerX, sunCenterY, sunRadius);
  drawTimeDrivenSunPulse(centerX, sunCenterY, sunRadius);

  // 绘制富士山主体。
  // Draw the main body of Mount Fuji.
  fill(35, 65, 100);
  beginShape();
  vertex(centerX - baseHalfWidth, height);
  vertex(centerX - craterHalfWidth, peakY);
  quadraticVertex(centerX, peakY + craterDepth, centerX + craterHalfWidth, peakY);
  vertex(centerX + baseHalfWidth, height);
  endShape(CLOSE);

  // 山顶雪线的位置和波纹参数。
  // Position and ripple parameters for the snowy mountain top.
  const snowBaseY = peakY + mountainHeight * 0.28;
  const snowHalfWidth = craterHalfWidth + (baseHalfWidth - craterHalfWidth) * (snowBaseY - peakY) / (height - peakY);
  const rippleAmp = mountainHeight * 0.040;
  const rippleFreq = PI * 4 / snowHalfWidth;
  const rippleStep = snowHalfWidth / 50;

  // 绘制白色雪顶，底部用 sin 做起伏边缘。
  // Draw the white snowy top, using sin to create a wavy lower edge.
  fill(242, 247, 255);
  beginShape();
  vertex(centerX - craterHalfWidth, peakY);
  quadraticVertex(centerX, peakY + craterDepth, centerX + craterHalfWidth, peakY);
  vertex(centerX + snowHalfWidth, snowBaseY);
  for (let dx = snowHalfWidth; dx >= -snowHalfWidth; dx -= rippleStep) {
    vertex(centerX + dx, snowBaseY + rippleAmp * abs(sin(dx * rippleFreq)));
  }
  vertex(centerX - snowHalfWidth, snowBaseY);
  endShape(CLOSE);

  // 给雪顶左侧加半透明阴影，让山更有立体感。
  // Add a translucent shadow to the left side of the snow cap to make the mountain feel more dimensional.
  fill(195, 215, 235, 150);
  beginShape();
  vertex(centerX - craterHalfWidth, peakY);
  quadraticVertex(centerX - craterHalfWidth / 2, peakY + craterDepth / 2, centerX, peakY + craterDepth / 2);
  vertex(centerX, snowBaseY);
  for (let dx = 0; dx >= -snowHalfWidth; dx -= rippleStep) {
    vertex(centerX + dx, snowBaseY + rippleAmp * abs(sin(dx * rippleFreq)));
  }
  vertex(centerX - snowHalfWidth, snowBaseY);
  endShape(CLOSE);
}

function windowResized() {
  // 当浏览器窗口大小改变时，重新调整画布尺寸。
  // Resize the canvas whenever the browser window size changes.
  resizeCanvas(windowWidth, windowHeight);
}
