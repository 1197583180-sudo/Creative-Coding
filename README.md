# IDEA9103: Creative Coding Group Project

**University of Sydney** | IDEA9103 Creative Coding Major Project
**Team:** Joy (Siying Song), Lihang Shi, Karina Zhu, Adinata Harlan

---

## Inspiration

Our project reinterprets **"The Great Wave off Kanagawa"** (*神奈川沖浪裏*) by **Katsushika Hokusai** (c. 1831). The woodblock print captures a towering wave at the peak of its power — frothy white foam breaking into chaos, deep indigo water coiling with tremendous force, and the serene silhouette of Mount Fuji standing small in the background. Its power lies in contrast: explosive motion against absolute stillness, organic chaos against geometric calm.

![The Great Wave off Kanagawa by Katsushika Hokusai](images/wave-1.jpg)

What inspired us was the idea that Hokusai froze the wave at one specific instant. We wanted to animate everything he *implied* — the wave before it broke, the ocean beneath it, the life inside it, the sound it would make. The ukiyo-e colour palette (prussian blue, cobalt, warm sky) and the layered woodblock printing technique shaped our decision to build wave colour through stacked, semi-transparent strokes rather than solid fills.

---

## Mechanic Ownership

### User Input — Joy

The user input mechanic gives the viewer two ways to directly interact with the scene.

**Mouse click (ocean area) — fish jumps:** Clicking anywhere in the lower ocean area triggers four fish to leap from the water at random positions across the canvas. Each fish follows a parabolic arc and travels forward in the direction it is facing, with a slight stagger between each one. Fish positions, facing directions, and jump distances are all randomised per click.

**Spacebar — wave surge:** Pressing the spacebar adds an immediate amplitude boost to all eight wave lines, making them surge visibly taller. The boost decays smoothly back to rest over roughly two seconds.

**Techniques:** Fish jump arcs use `sin(PI * progress)` to compute a parabolic vertical offset, combined with a linear horizontal offset so the fish travel forward in the direction they face. SVG fish images are loaded with `loadImage()` and drawn using `drawingContext.globalCompositeOperation = 'multiply'` to strip white backgrounds so they composite naturally against the ocean. The `keyPressed()` and `mousePressed()` p5.js event functions handle input, and a coordinate transform converts screen click positions into the 1000×500 design space to correctly detect ocean-area clicks.

---

### Time-Based Mechanic — Lihang

The time-based mechanic keeps the artwork in continuous motion without any viewer interaction.

**Two boats** float and bob along sinusoidal paths driven by elapsed time, layered between different wave lines to create depth. **The sun** pulses gently in size and radiates three expanding light rings that fade as they grow outward. When audio is active, the rings expand further and grow brighter in sync with the sun track's amplitude. **The background wave band** drifts slowly up and down, leaving a faint motion trail behind the foreground waves.

**Techniques:** Boat position and the sun pulse use `sin()` and `cos()` with elapsed time (`deltaSeconds` accumulated each frame) so animation speed is frame-rate independent. The three expanding sun rings each compute a `progress` value as `(time * speed + ring/3) % 1`, which staggers them evenly and loops continuously. Ring radius uses `lerp(sunRadius, sunRadius * maxScale, progress)` and ring alpha uses `pow(1 - progress, 3)` so rings fade out sharply as they expand. When audio is on, `sunGlowMultiplier` from the audio mechanic drives `maxScale` and the alpha multiplier, making the rings pulse with the music.

---

### Audio Mechanic — Karina

The audio mechanic connects two looping ambient tracks to the visual elements of the artwork.

**Toggling audio:** A music button in the top-left corner starts and stops playback.

**Wave response:** The wave ambient track is analysed with FFT each frame. Bass energy controls the overall wave height multiplier; each wave layer is additionally modulated by its own frequency band (upper waves = bass, mid waves = mid, lower waves = treble).

**Sun response:** The sun ambient track's amplitude drives `sunGlowMultiplier`, which controls the brightness and reach of the sun rays and the expansion size of the time-driven sun rings.

**Techniques:** `p5.FFT` analyses the wave track each frame using `waveFFT.analyze()` and `waveFFT.getEnergy("bass" / "mid" / "treble")` to extract per-band energy values (0–255). These are mapped with `map()` into multiplier ranges (e.g. `waveHeightMultiplier` 0.9–1.25) that scale the wave amplitude drawn in the Perlin mechanic. `p5.Amplitude` measures the sun track's overall level via `sunAmp.getLevel()`, mapped to `sunGlowMultiplier` (0.7–3.0). Two sounds are loaded with `loadSound()` in `setup()` and played with `.loop()`. The browser AudioContext is explicitly resumed via `userStartAudio()` and `context.resume()` on first interaction to satisfy browser autoplay policies.

---

### Perlin Noise & Randomness — Adinata

The Perlin noise mechanic is the foundation of the ocean's organic, ever-shifting appearance.

**Eight foreground wave lines** drift vertically within individually defined ranges using Perlin noise, each with its own speed and phase offset so no two waves ever move in sync. Wave curve shapes are also noise-driven, sampling a 2D noise field per vertex. Wave colours are built from layered strokes of prussian blue, cobalt, and sky blue. The fourth wave layer renders as a solid filled band below its curve. **Sun rays** use Perlin noise per ray to control length and brightness, creating an organic flicker effect.

**Techniques:** Wave vertical position is driven by `noise(waveIndex, time * speed)` mapped through `constrain(map(..., 0.25, 0.75, rangeMin, rangeMax))` so each wave oscillates within a defined positional band. Wave curve shapes use `beginShape()` / `curveVertex()` sampling `noise(x * frequency, time + timeOffset)` per vertex to produce smooth, continuously changing silhouettes. Motion trails work by appending the current wave offset to a `history[]` array each frame and replaying older states at progressively lower opacity — no secondary canvas needed. Sun rays iterate around 360° sampling `noise(angle, time)` per ray to vary length and `noise(angle + 100, time)` to vary brightness, giving the sun an organic, flickering glow.

---

## AI Acknowledgement

This project used **Claude Code (claude-sonnet-4-6 by Anthropic)** as an AI coding assistant throughout development. Claude was used to:

- Generate and refine code for all four mechanic files (`perlin-mechanic.js`, `time-mechanic.js`, `audio_mechanic.js`, `userinput-mechanic.js`) and the main orchestration in `sketch.js`
- Resolve merge conflicts between branches (particularly the audio branch merge that affected wave position logic)
- Debug coordinate system issues (canvas scaling, design-space transforms, fish jump direction logic)
- Integrate mechanics without introducing duplicate p5.js lifecycle functions (`preload`, `setup`, `draw`, `mousePressed`)
- Write and update this README

The generated code was reviewed, tested, and adjusted iteratively by the team. All final decisions about visual design, parameters, and interaction behaviour were made by the team.

> Note: as per the assignment requirement, code files contain comments noting where AI assistance was used.

---

## External References

- **p5.js library** — [https://p5js.org](https://p5js.org) — All drawing, noise, sound analysis, and animation functions are from the p5.js and p5.sound libraries.
- **"The Great Wave off Kanagawa"** by Katsushika Hokusai (c. 1831) — the source artwork this project reinterprets. Public domain via Wikimedia Commons.
- **p5.js FFT reference** — [https://p5js.org/reference/p5.sound/p5.FFT/](https://p5js.org/reference/p5.sound/p5.FFT/) — used to understand `getEnergy()` frequency band analysis for the audio mechanic.
- **p5.js Amplitude reference** — [https://p5js.org/reference/p5.sound/p5.Amplitude/](https://p5js.org/reference/p5.sound/p5.Amplitude/) — used for the sun amplitude → glow multiplier calculation.

---

## Interaction Instructions

1. **Open `index.html`** in a browser (Chrome or Firefox recommended). The artwork begins animating immediately — no interaction required to see the waves, boats, and sun.

2. **Toggle audio** — click the music button in the **top-left corner** of the canvas. The button dims when audio is off and brightens when playing. With audio on, the waves surge and pulse with the beat and the sun glows in response to the music's loudness.

3. **Summon fish** — click anywhere in the **lower ocean area** of the canvas (roughly the bottom half). Four fish will leap from the water at random positions, each jumping forward in the direction it faces, then splashing back down.

4. **Surge the waves** — press the **spacebar** at any time to cause all wave lines to swell taller. The surge decays naturally over about two seconds.

There is no wrong way to interact — try clicking repeatedly, holding spacebar, and toggling the audio on and off to see how the mechanics layer on top of each other.
