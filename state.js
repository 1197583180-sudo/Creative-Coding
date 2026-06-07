/*
  Shared state for all mechanics.

  Each mechanic should update these values instead of directly rewriting
  the base artwork. This keeps the project modular and easier to combine.
*/

const state = {
  // Primary wave controls
  waveHeight: 0.9,
  waveCurl: 1,
  crashAmount: 0,

  // User input controls
  interactionForce: 0,
  rippleStrength: 0,

  // Audio controls
  audioLevel: 0,
  bassEnergy: 0,

  // Perlin/random controls
  noiseStrength: 0.35,
  foamAmount: 0.65,

  // Layer-specific controls shared by all mechanics
  layers: {
    paper: {
      grainDensity: 1,
      grainAlpha: 1,
      vignette: 1
    },
    atmosphere: {
      mistOpacity: 1,
      mistOffsetX: 0,
      mistOffsetY: 0,
      cloudOpacity: 1
    },
    fuji: {
      scale: 1
    },
    boats: {
      driftX: 0,
      driftY: 0,
      tilt: 0
    },
    sea: {
      swell: 0,
      stripeFlow: 0,
      reflectionStrength: 1,
      reflectionDrift: 0
    },
    foam: {
      amount: 0.7,
      scale: 1,
      curlRotation: 0
    }
  },

  // Global visual controls
  showDebug: false
};
