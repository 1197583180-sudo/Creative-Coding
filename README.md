# Breathing Wave - Modular Seascape

This is a modular p5.js artwork for a mountain, sea, and boat scene.

The goal is not to reproduce a reference painting as closely as possible. Instead, the artwork is treated as a visual system made from separate controllable layers. Each future mechanic can change shared state values and influence the same unified composition.

## Current Version

This version establishes a calm shared visual foundation before each team member develops their own mechanic. The composition is separated into:

- paper / background
- atmosphere / mist
- Mount Fuji
- boat
- broad sea bands
- foreground swell
- light foam / reflection marks
- modular script files for each mechanic

## File Structure

- `sketch.js`: main p5.js setup and draw loop
- `state.js`: shared values that mechanics can update
- `artwork-base.js`: visual layer orchestration
- `layers/`: separated artwork layers
  - `paper-layer.js`
  - `atmosphere-layer.js`
  - `fuji-layer.js`
  - `sea-layer.js`
  - `boats-layer.js`
  - `wave-layer.js`
  - `foam-layer.js`
- `time-mechanic.js`: time-based mechanic placeholder
- `input-mechanic.js`: user input mechanic placeholder
- `audio-mechanic.js`: audio mechanic placeholder
- `perlin-mechanic.js`: Perlin noise and randomness placeholder

## Next Step

Each mechanic should update shared values in `state.js` instead of rewriting layer files directly. This lets time, input, audio, and randomness affect different visual parts while keeping the final image coherent.
