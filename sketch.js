const PIXEL_W = 240;
const PIXEL_H = 160;

let waveReference;
let pixelWave;

const palette = {
  paperLight: "#f0dfbf",
  paper: "#dfc8a3",
  paperDark: "#b9aa91",
  ink: "#111111",
  navy: "#0b174b",
  deepBlue: "#123d79",
  blue: "#1f70a7",
  paleBlue: "#a8d9df",
  foam: "#fffbee",
  foamShadow: "#dce9df",
  boat: "#c08d63",
};

function preload() {
  waveReference = loadImage("images/wave-1.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noSmooth();
  noLoop();

  pixelWave = createGraphics(PIXEL_W, PIXEL_H);
  pixelWave.pixelDensity(1);
  pixelWave.noSmooth();
}

function draw() {
  background(palette.paper);
  randomSeed(1831);

  buildPixelWaveFromReference();
  applyOceanSort();
  eraseUpperLeftTextArtifacts();

  image(pixelWave, 0, 0, width, height);
}

function buildPixelWaveFromReference() {
  pixelWave.clear();

  const source = coverCrop(waveReference.width, waveReference.height, PIXEL_W, PIXEL_H);
  pixelWave.image(
    waveReference,
    0,
    0,
    PIXEL_W,
    PIXEL_H,
    source.x,
    source.y,
    source.w,
    source.h
  );

  quantizeToPixelPalette();
  addBlockTexture();
}

function coverCrop(sourceW, sourceH, targetW, targetH) {
  const sourceRatio = sourceW / sourceH;
  const targetRatio = targetW / targetH;

  if (sourceRatio > targetRatio) {
    const cropW = sourceH * targetRatio;
    return {
      x: (sourceW - cropW) / 2,
      y: 0,
      w: cropW,
      h: sourceH,
    };
  }

  const cropH = sourceW / targetRatio;
  return {
    x: 0,
    y: (sourceH - cropH) / 2,
    w: sourceW,
    h: cropH,
  };
}

function quantizeToPixelPalette() {
  pixelWave.loadPixels();

  for (let y = 0; y < PIXEL_H; y++) {
    for (let x = 0; x < PIXEL_W; x++) {
      const p = readPixel(x, y);
      const mapped = mapReferenceColor(p, x, y);
      writePixel(x, y, mapped);
    }
  }

  pixelWave.updatePixels();
}

function mapReferenceColor(p, x, y) {
  const brightness = (p.r + p.g + p.b) / 3;
  const blueBias = p.b - (p.r + p.g) * 0.5;
  const redBias = p.r - p.b;

  if (brightness < 48) {
    return hexToRgba(palette.ink);
  }

  if (blueBias > 26 && brightness < 78) {
    return hexToRgba(palette.navy);
  }

  if (blueBias > 18 && brightness < 118) {
    return hexToRgba(palette.deepBlue);
  }

  if (blueBias > 8 && brightness < 165) {
    return hexToRgba(palette.blue);
  }

  if (blueBias > -3 && brightness < 205) {
    return hexToRgba(palette.paleBlue);
  }

  if (brightness > 213) {
    return hexToRgba(palette.foam);
  }

  if (redBias > 35 && brightness < 190 && y > PIXEL_H * 0.45) {
    return hexToRgba(palette.boat);
  }

  if (brightness < 132) {
    return hexToRgba(palette.paperDark);
  }

  if (brightness < 180) {
    return hexToRgba(palette.paper);
  }

  return hexToRgba(palette.paperLight);
}

function addBlockTexture() {
  pixelWave.noStroke();

  for (let y = 0; y < PIXEL_H; y += 4) {
    for (let x = 0; x < PIXEL_W; x += 4) {
      if ((x + y) % 12 === 0) {
        pixelWave.fill(255, 248, 226, 28);
        pixelWave.rect(x, y, 4, 4);
      }
    }
  }

  pixelWave.loadPixels();
  const highlightSpots = [];
  for (let i = 0; i < 260; i++) {
    const x = floor(random(PIXEL_W));
    const y = floor(random(PIXEL_H));
    const p = readPixel(x, y);
    if (isFoamPixel(p) || isBluePixel(p)) {
      highlightSpots.push({ x, y, w: random([1, 1, 2]), h: random([1, 1, 2]) });
    }
  }
  pixelWave.updatePixels();

  pixelWave.fill(255, 255, 255, 120);
  for (const spot of highlightSpots) {
    pixelWave.rect(spot.x, spot.y, spot.w, spot.h);
  }
}

function applyOceanSort() {
  pixelWave.loadPixels();

  for (let x = 0; x < PIXEL_W; x += 2) {
    const waterRun = [];

    for (let y = 0; y < PIXEL_H; y++) {
      const p = readPixel(x, y);
      if (isBluePixel(p) && !isBottomRightPatch(x, y)) {
        waterRun.push({ x, y, p });
      }
    }

    if (waterRun.length > 12) {
      const sorted = waterRun
        .map((item) => item.p)
        .sort((a, b) => brightnessValue(a) - brightnessValue(b));
      const pull = floor(map(noise(x * 0.055), 0, 1, 0, 8));

      for (let i = 0; i < waterRun.length; i++) {
        const sourceIndex = constrain(i - pull, 0, sorted.length - 1);
        writePixel(waterRun[i].x, waterRun[i].y, sorted[sourceIndex]);
      }
    }
  }

  for (let y = 0; y < PIXEL_H; y += 2) {
    const foamRun = [];

    for (let x = 0; x < PIXEL_W; x++) {
      const p = readPixel(x, y);
      if (isFoamPixel(p) && !isBottomRightPatch(x, y)) {
        foamRun.push({ x, y, p });
      }
    }

    if (foamRun.length > 18) {
      const sorted = foamRun
        .map((item) => item.p)
        .sort((a, b) => brightnessValue(b) - brightnessValue(a));
      const drift = floor(map(noise(y * 0.09), 0, 1, -5, 7));

      for (let i = 0; i < foamRun.length; i++) {
        const targetX = constrain(foamRun[i].x + drift, 0, PIXEL_W - 1);
        writePixel(targetX, foamRun[i].y, sorted[i]);
      }
    }
  }

  pixelWave.updatePixels();
}

function isBottomRightPatch(x, y) {
  return x > PIXEL_W * 0.62 && y > PIXEL_H * 0.48;
}

function eraseUpperLeftTextArtifacts() {
  pixelWave.loadPixels();

  for (let y = 7; y < 54; y++) {
    for (let x = 5; x < 42; x++) {
      if (!isUpperLeftTextArea(x, y)) {
        continue;
      }

      const p = readPixel(x, y);
      if (isBluePixel(p) || isDarkPixel(p) || isPaleBluePixel(p)) {
        writePixel(x, y, skyPaperPixel(x, y));
      }
    }
  }

  pixelWave.updatePixels();
}

function isUpperLeftTextArea(x, y) {
  const titlePanel = x >= 10 && x <= 28 && y >= 8 && y <= 45;
  const sideSignature = x >= 5 && x <= 16 && y >= 24 && y <= 51;
  const looseCharacters = x >= 18 && x <= 39 && y >= 14 && y <= 47;
  return titlePanel || sideSignature || looseCharacters;
}

function skyPaperPixel(x, y) {
  const skyShift = noise(x * 0.21, y * 0.17);
  if (skyShift < 0.18) {
    return hexToRgba(palette.foam);
  }

  if (skyShift < 0.62) {
    return hexToRgba(palette.paperLight);
  }

  return hexToRgba(palette.paper);
}

function readPixel(x, y) {
  const index = 4 * (floor(y) * PIXEL_W + floor(x));
  return {
    r: pixelWave.pixels[index],
    g: pixelWave.pixels[index + 1],
    b: pixelWave.pixels[index + 2],
    a: pixelWave.pixels[index + 3],
  };
}

function writePixel(x, y, p) {
  const index = 4 * (floor(y) * PIXEL_W + floor(x));
  pixelWave.pixels[index] = p.r;
  pixelWave.pixels[index + 1] = p.g;
  pixelWave.pixels[index + 2] = p.b;
  pixelWave.pixels[index + 3] = p.a;
}

function isBluePixel(p) {
  return p.b > p.r + 22 && p.b >= p.g - 4;
}

function isDarkPixel(p) {
  return brightnessValue(p) < 70;
}

function isPaleBluePixel(p) {
  return p.b > p.r + 8 && p.g > p.r + 6 && brightnessValue(p) > 150;
}

function isFoamPixel(p) {
  return p.r > 225 && p.g > 220 && p.b > 205;
}

function brightnessValue(p) {
  return p.r * 0.299 + p.g * 0.587 + p.b * 0.114;
}

function hexToRgba(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
    a: 255,
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
