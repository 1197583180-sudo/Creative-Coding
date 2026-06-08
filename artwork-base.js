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

function windowResized() {
  // 当浏览器窗口大小改变时，重新调整画布尺寸。
  // Resize the canvas whenever the browser window size changes.
  resizeCanvas(windowWidth, windowHeight);
}
