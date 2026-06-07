/*
  Atmosphere layer.

  Draws distance: mist, air, and soft cloud forms behind the main wave.
*/

function drawAtmosphereLayer() {
  const atmosphere = state.layers.atmosphere;

  noStroke();

  for (let i = 0; i < 24; i++) {
    fill(92, 116, 124, 8 * atmosphere.mistOpacity);
    ellipse(
      680 + atmosphere.mistOffsetX,
      400 + i * 4 + atmosphere.mistOffsetY,
      720 - i * 10,
      56
    );
  }

  fill(250, 246, 226, 86 * atmosphere.cloudOpacity);
  ellipse(245, 145, 240, 46);
  ellipse(375, 132, 130, 34);
  ellipse(890, 180, 250, 50);
  ellipse(1040, 195, 160, 38);
}
