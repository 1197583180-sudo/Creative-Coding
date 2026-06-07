/*
  Base artwork orchestration.

  The artwork is split into visual layers so each mechanic can affect a
  defined part of the composition through shared state values.
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

  drawPaperLayer();
  drawAtmosphereLayer();
  drawFujiLayer();
  drawSeaLayer();
  drawBoatLayer();
  drawMainWaveLayer();
  drawFoamLayer();

  endArtworkTransform();
}
