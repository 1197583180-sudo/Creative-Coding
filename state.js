/*
  Shared state for all mechanics.

  Each mechanic should update these values instead of directly rewriting
  the base artwork. This keeps the project modular and easier to combine.
*/

const state = {
  // Time-based mechanic can control these later
  waveHeight: 1,
  waveCurl: 1,
  crashAmount: 0,

  // User input mechanic can control these later
  interactionForce: 0,
  rippleStrength: 0,

  // Audio mechanic can control these later
  audioLevel: 0,
  bassEnergy: 0,

  // Perlin/random mechanic can control these later
  noiseStrength: 0.35,
  foamAmount: 1,

  // Global visual controls
  showDebug: false
};
