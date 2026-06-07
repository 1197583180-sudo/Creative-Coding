/*
  Base artwork layer.

  This file draws a simplified, abstract woodblock-inspired version of
  Hokusai's The Great Wave off Kanagawa. It should stay mostly visual.
  Mechanics should update values in state.js instead of rewriting this file.
*/

const palette = {
  paper: "#efe4c8",
  paperShadow: "#dfd0aa",
  ink: "#173f5f",
  deepBlue: "#06456f",
  midBlue: "#2b78a0",
  paleBlue: "#a9d4d2",
  foam: "#f7f4e7",
  foamShadow: "#c9e1dc",
  boat: "#d49a6a",
  boatLine: "#5b4234",
  mountain: "#f7f4e7",
  mountainShadow: "#2d4f67",
  mist: "#6f7771"
};

function drawArtworkBase() {
  beginArtworkTransform();

  drawPaperBackground();
  drawDistantMist();
  drawMountFuji();
  drawBackWave();
  drawBoats();
  drawMainSea();
  drawGreatWave();
  drawForegroundFoam();
  drawSignatureBlock();

  endArtworkTransform();
}

function drawPaperBackground() {
  background(palette.paper);

  // Subtle aged paper texture.
  noStroke();
  randomSeed(12);
  for (let i = 0; i < 900; i++) {
    const x = random(designW);
    const y = random(designH);
    const s = random(0.5, 2.2);
    fill(120, 95, 55, random(6, 18));
    circle(x, y, s);
  }

  // Slight vignette.
  for (let i = 0; i < 18; i++) {
    noFill();
    stroke(90, 70, 40, 8);
    rect(i * 3, i * 3, designW - i * 6, designH - i * 6);
  }
}

function drawDistantMist() {
  noStroke();

  // Grey mist band behind Fuji, based on the atmospheric band in the reference.
  for (let i = 0; i < 18; i++) {
    fill(80, 90, 85, 10);
    ellipse(710, 430 + i * 3, 560 - i * 8, 54);
  }

  // Soft cloud shapes.
  fill(255, 250, 230, 92);
  ellipse(695, 165, 180, 46);
  ellipse(770, 157, 110, 40);
  ellipse(920, 300, 220, 50);
  ellipse(1040, 310, 150, 42);
}

function drawMountFuji() {
  push();
  translate(690, 420);

  stroke(palette.ink);
  strokeWeight(2.2);
  fill(palette.mountain);
  triangle(-78, 105, 0, -42, 92, 105);

  noStroke();
  fill(palette.mountainShadow);
  triangle(3, -22, 92, 105, 20, 105);
  fill(palette.foam);
  triangle(-20, 0, 0, -42, 25, 8);

  stroke(palette.ink);
  strokeWeight(1.2);
  line(-78, 105, 92, 105);

  pop();
}

function drawBackWave() {
  push();

  // Right sweeping wave ridge.
  noStroke();
  fill(palette.foam);
  beginShape();
  vertex(660, 560);
  bezierVertex(790, 455, 980, 500, 1195, 300);
  vertex(1200, 640);
  bezierVertex(1040, 615, 800, 590, 660, 560);
  endShape(CLOSE);

  fill(palette.paleBlue);
  beginShape();
  vertex(680, 585);
  bezierVertex(820, 520, 990, 540, 1200, 365);
  vertex(1200, 650);
  bezierVertex(1040, 625, 860, 612, 680, 585);
  endShape(CLOSE);

  stroke(palette.ink);
  strokeWeight(2);
  noFill();
  bezier(662, 560, 820, 455, 990, 520, 1198, 300);

  // Blue streaks inside the right wave.
  noStroke();
  fill(palette.deepBlue);
  for (let i = 0; i < 8; i++) {
    const y = 575 + i * 20;
    beginShape();
    vertex(860 + i * 16, y);
    bezierVertex(945 + i * 10, y - 18, 1070, y - 20, 1198, y - 70);
    vertex(1198, y - 52);
    bezierVertex(1060, y + 6, 940, y + 12, 860 + i * 16, y + 10);
    endShape(CLOSE);
  }

  pop();
}

function drawBoats() {
  drawBoat(230, 505, -9, 1.05);
  drawBoat(665, 545, 2, 1.12);
  drawBoat(970, 455, -11, 0.85);
}

function drawBoat(x, y, angleDeg, s) {
  push();
  translate(x, y);
  rotate(radians(angleDeg));
  scale(s);

  stroke(palette.boatLine);
  strokeWeight(2);
  fill(palette.boat);

  // Long narrow boat body.
  beginShape();
  vertex(-115, 15);
  bezierVertex(-75, 38, 78, 38, 125, 10);
  vertex(105, 35);
  bezierVertex(45, 58, -72, 55, -115, 15);
  endShape(CLOSE);

  // Inner lines.
  strokeWeight(1.4);
  for (let i = -75; i <= 70; i += 18) {
    line(i, 26, i + 12, 44);
  }
  line(-85, 22, 95, 25);
  line(-60, 38, 74, 39);

  // Rowers / passengers as small rounded forms.
  noStroke();
  fill("#c98c7d");
  for (let i = -40; i <= 70; i += 22) {
    ellipse(i, 20, 14, 9);
  }

  pop();
}

function drawMainSea() {
  push();

  // Foreground sweeping sea base.
  noStroke();
  fill(palette.foam);
  beginShape();
  vertex(0, 640);
  bezierVertex(190, 580, 310, 615, 430, 570);
  bezierVertex(580, 520, 770, 575, 1200, 625);
  vertex(1200, 760);
  vertex(0, 760);
  endShape(CLOSE);

  fill(palette.paleBlue);
  beginShape();
  vertex(0, 675);
  bezierVertex(220, 620, 370, 650, 520, 600);
  bezierVertex(710, 560, 890, 625, 1200, 660);
  vertex(1200, 760);
  vertex(0, 760);
  endShape(CLOSE);

  // Dark blue water streaks.
  fill(palette.deepBlue);
  for (let i = 0; i < 11; i++) {
    const x = 470 + i * 68;
    const y = 590 + i * 8;
    beginShape();
    vertex(x, y);
    bezierVertex(x + 40, y + 15, x + 115, y + 22, x + 220, y + 5);
    vertex(x + 220, y + 24);
    bezierVertex(x + 120, y + 48, x + 40, y + 32, x, y + 18);
    endShape(CLOSE);
  }

  stroke(palette.ink);
  strokeWeight(2);
  noFill();
  bezier(0, 640, 190, 580, 310, 615, 430, 570);
  bezier(430, 570, 580, 520, 770, 575, 1200, 625);

  pop();
}

function drawGreatWave() {
  push();

  const h = state.waveHeight;
  const curl = state.waveCurl;
  const crash = state.crashAmount;

  // Large dark body of the wave.
  noStroke();
  fill(palette.deepBlue);
  beginShape();
  vertex(40, 520);
  bezierVertex(130, 390, 250, 330, 355, 305);
  bezierVertex(420, 288, 480, 315, 507, 380 - 25 * h);
  bezierVertex(530, 465, 470, 545, 450, 650);
  bezierVertex(350, 610, 235, 600, 40, 620);
  endShape(CLOSE);

  // White crest and upper foam mass.
  fill(palette.foam);
  beginShape();
  vertex(300, 190);
  bezierVertex(405, 70, 560, 55, 665, 130);
  bezierVertex(735, 180, 744, 240, 700, 285);
  bezierVertex(640, 255, 555, 245, 485, 275);
  bezierVertex(405, 310, 330, 300, 260, 330);
  bezierVertex(250, 275, 260, 230, 300, 190);
  endShape(CLOSE);

  // Blue inner wave fingers.
  fill(palette.midBlue);
  for (let i = 0; i < 8; i++) {
    const x = 255 + i * 35;
    beginShape();
    vertex(x, 320);
    bezierVertex(x + 12, 250, x + 28, 210, x + 66, 170);
    bezierVertex(x + 85, 210, x + 77, 275, x + 40, 390);
    bezierVertex(x + 20, 375, x + 5, 350, x, 320);
    endShape(CLOSE);
  }

  fill(palette.deepBlue);
  for (let i = 0; i < 6; i++) {
    const x = 290 + i * 38;
    beginShape();
    vertex(x, 340);
    bezierVertex(x + 15, 255, x + 30, 215, x + 64, 185);
    bezierVertex(x + 72, 245, x + 55, 330, x + 22, 420);
    endShape(CLOSE);
  }

  // Main outline.
  stroke(palette.ink);
  strokeWeight(3);
  noFill();
  bezier(40, 520, 130, 390, 250, 330, 355, 305);
  bezier(300, 190, 405, 70, 560, 55, 665, 130);
  bezier(665, 130, 735, 180, 744, 240, 700, 285);

  // Claw-like foam curls.
  drawFoamCurls(585, 150, 1.15, -8);
  drawFoamCurls(642, 220, 1.05, 8);
  drawFoamCurls(520, 235, 0.92, -15);
  drawFoamCurls(405, 280, 0.9, 10);
  drawFoamCurls(260, 380, 0.85, -12);
  drawFoamCurls(150, 465, 0.95, 18);

  // Foam dots inside the wave.
  randomSeed(7);
  noStroke();
  fill(palette.foam);
  const foamCount = floor(120 * state.foamAmount);
  for (let i = 0; i < foamCount; i++) {
    const x = random(120, 520);
    const y = random(230, 610);
    if (random() > 0.25) {
      circle(x, y, random(2, 7));
    }
  }

  pop();
}

function drawFoamCurls(x, y, s, rot) {
  push();
  translate(x, y);
  rotate(radians(rot));
  scale(s);

  stroke(palette.ink);
  strokeWeight(2);
  noFill();

  for (let i = 0; i < 7; i++) {
    const a = i * 22;
    const px = cos(radians(a)) * 48;
    const py = sin(radians(a)) * 20;

    push();
    translate(px, py);
    rotate(radians(a - 60));
    arc(0, 0, 45 - i * 2, 34 - i, 190, 25);
    pop();
  }

  noStroke();
  fill(palette.foam);
  ellipse(0, 0, 130, 42);
  fill(palette.foamShadow);
  ellipse(-15, 8, 70, 18);

  pop();
}

function drawForegroundFoam() {
  push();

  // Lower left foam cloud.
  fill(palette.foam);
  stroke(palette.ink);
  strokeWeight(2);

  for (let i = 0; i < 28; i++) {
    const x = 40 + (i % 8) * 55 + random(-5, 5);
    const y = 625 + floor(i / 8) * 32 + random(-5, 5);
    arc(x, y, 70, 45, 170, 25);
  }

  // Light foam wash.
  noStroke();
  fill(palette.foamShadow);
  for (let i = 0; i < 18; i++) {
    ellipse(150 + i * 18, 610 + sin(i) * 25, 52, 20);
  }

  pop();
}

function drawSignatureBlock() {
  push();
  translate(58, 58);

  noFill();
  stroke(palette.ink);
  strokeWeight(1.5);
  rect(0, 0, 42, 150);

  fill(palette.ink);
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);

  // Decorative placeholder text to reference the vertical label in the print.
  // It is intentionally abstracted rather than copied as readable Japanese text.
  const marks = ["富", "嶽", "三", "十", "六", "景", "神", "奈", "川"];
  for (let i = 0; i < marks.length; i++) {
    text(marks[i], 21, 8 + i * 15);
  }

  pop();
}
