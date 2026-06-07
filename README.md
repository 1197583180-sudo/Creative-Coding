# Breathing Wave - Base Artwork

This is the base artwork version for a p5.js reinterpretation of Katsushika Hokusai's *The Great Wave off Kanagawa*.

## Current Version

This version establishes the shared visual foundation before each team member develops their own mechanic. It includes:

- an abstract woodblock-inspired background
- Mount Fuji
- simplified boats
- a large wave structure
- foam and water shapes
- modular script files for each mechanic

## File Structure

- `sketch.js`: main p5.js setup and draw loop
- `state.js`: shared values that mechanics can update
- `artwork-base.js`: base visual artwork
- `time-mechanic.js`: time-based mechanic placeholder
- `input-mechanic.js`: user input mechanic placeholder
- `audio-mechanic.js`: audio mechanic placeholder
- `perlin-mechanic.js`: Perlin noise and randomness placeholder

## Next Step

Each mechanic should update shared values in `state.js` instead of rewriting the base artwork directly.
