/*
  Fuji layer.

  A distant illustrated mountain. The shapes stay simple, but the silhouette,
  snow line, shadows, and atmospheric veil are designed as one coherent form.
*/

function drawFujiLayer() {
  const fuji = state.layers.fuji;

  push();
  translate(650, 394);
  scale(fuji.scale);

  drawMountainBackGlow();
  drawMountainBody();
  drawMountainSlopeShadows();
  drawMountainSnowCap();
  drawMountainAtmosphereVeil();

  pop();
}

function drawMountainBackGlow() {
  noStroke();
  fill(245, 239, 215, 46);
  ellipse(4, 34, 520, 210);
}

function drawMountainBody() {
  stroke(34, 75, 93, 118);
  strokeWeight(1.35);
  fill("#d9ddd0");

  beginShape();
  vertex(-236, 142);
  bezierVertex(-184, 105, -139, 59, -98, 4);
  bezierVertex(-62, -44, -31, -92, -2, -136);
  bezierVertex(29, -89, 66, -34, 106, 18);
  bezierVertex(148, 72, 190, 112, 238, 142);
  bezierVertex(148, 156, 52, 162, -42, 158);
  bezierVertex(-118, 155, -184, 150, -236, 142);
  endShape(CLOSE);
}

function drawMountainSlopeShadows() {
  noStroke();

  fill(149, 177, 176, 132);
  beginShape();
  vertex(2, -122);
  bezierVertex(38, -66, 82, -4, 126, 54);
  bezierVertex(158, 96, 194, 126, 236, 142);
  bezierVertex(150, 153, 72, 158, -8, 156);
  bezierVertex(28, 88, 24, 0, 2, -122);
  endShape(CLOSE);

  fill(194, 205, 191, 118);
  beginShape();
  vertex(-6, -126);
  bezierVertex(-42, -73, -83, -13, -124, 38);
  bezierVertex(-153, 74, -184, 107, -226, 140);
  bezierVertex(-166, 150, -96, 155, -34, 157);
  bezierVertex(-46, 84, -32, -12, -6, -126);
  endShape(CLOSE);

  fill(113, 148, 156, 76);
  beginShape();
  vertex(34, -72);
  bezierVertex(68, -18, 102, 39, 138, 88);
  bezierVertex(112, 96, 82, 100, 42, 98);
  bezierVertex(46, 41, 43, -18, 34, -72);
  endShape(CLOSE);
}

function drawMountainSnowCap() {
  noStroke();

  fill("#fff9ea");
  beginShape();
  vertex(-54, -52);
  bezierVertex(-36, -86, -17, -114, -2, -136);
  bezierVertex(15, -109, 35, -77, 58, -42);
  bezierVertex(42, -46, 30, -34, 18, -36);
  bezierVertex(7, -38, -1, -58, -12, -44);
  bezierVertex(-24, -29, -38, -50, -54, -52);
  endShape(CLOSE);

  fill(222, 232, 224, 120);
  beginShape();
  vertex(0, -128);
  bezierVertex(18, -100, 38, -68, 58, -42);
  bezierVertex(43, -44, 30, -34, 18, -36);
  bezierVertex(10, -54, 6, -84, 0, -128);
  endShape(CLOSE);

  stroke(214, 224, 217, 135);
  strokeWeight(1);
  noFill();
  bezier(-47, -54, -26, -42, -15, -48, -4, -58);
  bezier(-3, -58, 8, -46, 19, -38, 52, -43);
}

function drawMountainAtmosphereVeil() {
  noStroke();

  fill(239, 231, 202, 70);
  beginShape();
  vertex(-250, 118);
  bezierVertex(-160, 104, -74, 116, 10, 110);
  bezierVertex(102, 104, 177, 112, 252, 104);
  vertex(252, 170);
  vertex(-250, 170);
  endShape(CLOSE);

  fill(188, 207, 199, 45);
  ellipse(0, 142, 470, 42);
  ellipse(-90, 128, 210, 26);
  ellipse(118, 126, 250, 30);
}
