/*
  Boats layer.

  A single illustrated wooden boat. The boat is built from coherent structural
  parts so later mechanics can drift or tilt it without changing its drawing.
*/

const boatColors = {
  outline: "#5c3424",
  rimDark: "#6f3c27",
  rimLight: "#d58a4f",
  hullTop: "#c8713d",
  hullMid: "#b75e31",
  hullLow: "#9b4b29",
  interior: "#5f392b",
  interiorLight: "#9f623e",
  highlight: "#e0a268",
  shadow: "#123f58"
};

function drawBoatLayer() {
  drawBoat(610, 565, -2, 1.08, 0);
}

function drawBoat(x, y, angleDeg, s, index) {
  const boats = state.layers.boats;

  push();
  translate(x + boats.driftX * (index + 1), y + boats.driftY);
  rotate(radians(angleDeg + boats.tilt));
  scale(s);

  drawBoatWaterContact();
  drawRestingOarBack();
  drawBoatOuterHull();
  drawBoatInnerWell();
  drawBoatRim();
  drawBoatPlankSeams();
  drawRestingOarFront();

  pop();
}

function drawBoatWaterContact() {
  noStroke();
  fill(18, 63, 88, 85);
  ellipse(0, 67, 338, 30);

  fill(247, 244, 231, 70);
  ellipse(-95, 58, 72, 5);
  ellipse(110, 57, 96, 5);
}

function drawRestingOarBack() {
  push();
  translate(18, -1);
  rotate(radians(-58));

  strokeCap(ROUND);
  stroke(boatColors.rimDark);
  strokeWeight(9);
  line(0, -4, 0, -138);

  stroke("#c77943");
  strokeWeight(5.5);
  line(0, -4, 0, -138);

  pop();
}

function drawBoatOuterHull() {
  stroke(boatColors.outline);
  strokeWeight(1.8);

  fill(boatColors.hullMid);
  beginShape();
  vertex(-168, -22);
  bezierVertex(-132, -15, -80, -11, -18, -11);
  bezierVertex(55, -11, 118, -15, 170, -23);
  bezierVertex(162, 14, 145, 47, 116, 67);
  bezierVertex(70, 82, -40, 89, -112, 69);
  bezierVertex(-142, 51, -160, 18, -168, -22);
  endShape(CLOSE);

  noStroke();
  fill(boatColors.hullTop);
  beginShape();
  vertex(-158, -12);
  bezierVertex(-104, -6, -45, -4, 15, -4);
  bezierVertex(76, -4, 128, -8, 158, -14);
  bezierVertex(154, 1, 150, 15, 144, 27);
  bezierVertex(74, 37, -76, 35, -152, 23);
  bezierVertex(-155, 12, -157, 1, -158, -12);
  endShape(CLOSE);

  fill(boatColors.hullLow);
  beginShape();
  vertex(-148, 31);
  bezierVertex(-74, 44, 60, 48, 140, 35);
  bezierVertex(131, 51, 112, 64, 84, 72);
  bezierVertex(32, 84, -58, 82, -112, 66);
  bezierVertex(-130, 56, -142, 44, -148, 31);
  endShape(CLOSE);
}

function drawBoatInnerWell() {
  noStroke();
  fill(boatColors.interior);
  beginShape();
  vertex(-128, -13);
  bezierVertex(-78, -5, -28, -2, 24, -3);
  bezierVertex(74, -4, 111, -8, 134, -14);
  bezierVertex(106, 4, 55, 13, -2, 12);
  bezierVertex(-55, 12, -105, 4, -128, -13);
  endShape(CLOSE);

  fill(boatColors.interiorLight);
  beginShape();
  vertex(-98, -5);
  bezierVertex(-48, 1, 36, 2, 100, -8);
  bezierVertex(70, 4, 34, 8, -4, 7);
  bezierVertex(-40, 7, -73, 3, -98, -5);
  endShape(CLOSE);
}

function drawBoatRim() {
  stroke(boatColors.outline);
  strokeWeight(1.6);
  fill(boatColors.rimLight);

  beginShape();
  vertex(-174, -34);
  bezierVertex(-114, -25, -48, -21, 18, -22);
  bezierVertex(82, -22, 134, -26, 176, -35);
  vertex(173, -19);
  bezierVertex(117, -10, 54, -6, -9, -7);
  bezierVertex(-73, -7, -129, -11, -171, -18);
  endShape(CLOSE);

  noStroke();
  fill(boatColors.rimDark);
  beginShape();
  vertex(-169, -18);
  bezierVertex(-111, -10, -49, -6, 15, -7);
  bezierVertex(78, -7, 127, -10, 171, -18);
  vertex(169, -11);
  bezierVertex(118, -3, 56, 1, -8, 0);
  bezierVertex(-72, 0, -128, -4, -166, -11);
  endShape(CLOSE);

  stroke(boatColors.highlight);
  strokeWeight(1);
  noFill();
  bezier(-158, -29, -90, -20, 50, -19, 164, -31);
}

function drawBoatPlankSeams() {
  stroke(92, 52, 36, 150);
  strokeWeight(1.05);
  noFill();

  bezier(-156, 4, -88, 15, 62, 18, 153, 5);
  bezier(-150, 24, -76, 38, 58, 42, 143, 29);
  bezier(-135, 48, -66, 64, 43, 70, 118, 55);

  stroke(111, 60, 39, 135);
  strokeWeight(0.8);
  for (let x = -118; x <= 118; x += 34) {
    const topY = -6 + abs(x) * 0.015;
    const bottomY = 62 - abs(x) * 0.08;
    line(x, topY, x + 8, bottomY);
  }

  noStroke();
  fill(224, 162, 104, 165);
  for (let x = -128; x <= 128; x += 32) {
    ellipse(x, -16, 3.5, 2.8);
  }
}

function drawRestingOarFront() {
  push();
  translate(18, -1);
  rotate(radians(-58));

  strokeCap(ROUND);
  stroke(boatColors.rimDark);
  strokeWeight(9);
  line(0, 0, 0, 122);

  stroke("#c77943");
  strokeWeight(5.5);
  line(0, 0, 0, 122);

  noStroke();
  fill("#a84f29");
  beginShape();
  vertex(-15, 104);
  bezierVertex(10, 111, 25, 132, 27, 164);
  bezierVertex(19, 190, -1, 216, -18, 230);
  bezierVertex(-36, 210, -48, 182, -47, 153);
  bezierVertex(-42, 127, -31, 111, -15, 104);
  endShape(CLOSE);

  fill("#c76f3b");
  beginShape();
  vertex(-12, 114);
  bezierVertex(4, 121, 14, 139, 15, 162);
  bezierVertex(10, 182, -3, 202, -16, 215);
  bezierVertex(-29, 198, -36, 176, -35, 154);
  bezierVertex(-32, 135, -24, 121, -12, 114);
  endShape(CLOSE);

  pop();

  noStroke();
  fill(boatColors.rimDark);
  ellipse(18, -1, 30, 32);
  fill("#efe4c8");
  ellipse(18, -1, 17, 20);
}
