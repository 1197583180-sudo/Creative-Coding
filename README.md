# IDEA9103: Creative Coding Group Project

**University of Sydney** | IDEA9103 Creative Coding
**Team:** Joy, Lihang, Karina, Adinata

---

## Part 1: Project Direction

### Artwork We Are Reinterpreting

Our project reinterprets **"The Great Wave off Kanagawa"** (*神奈川沖浪裏*) by **Katsushika Hokusai** (c. 1831), one of the most iconic woodblock prints in the world. The composition captures a towering, claw-like wave at the moment of its peak — frothy white foam breaking into chaos, deep indigo water coiling with tremendous force, and the serene silhouette of Mount Fuji standing small in the background. Its power lies in contrast: explosive motion against absolute stillness, organic chaos against geometric calm.

![The Great Wave off Kanagawa by Katsushika Hokusai](images/wave-1.jpg)

### Vision

We reinterpret *The Great Wave off Kanagawa* by transforming its frozen moment of tension into a living, reactive artwork built in p5.js. Hokusai captured a single frame of the ocean at its most violent — we animate what came before and after that instant. Perlin noise drives the organic swell and roll of water across the canvas, sculpting wave forms that rise and fall like the sea itself; audio amplifies the surge, making the pixel-sorted foam and spray pulse with sound; time governs the tidal rhythm, cycling the image between calm surface and crashing peak; and user input gives the viewer agency to direct the current, steering the distortion like wind across water. Together, these four mechanics transform a still woodblock print into something fluid, turbulent, and ever-shifting — a wave that never quite breaks the same way twice.

---

## Part 2: Individual Mechanics

### 🖱️ User Input (Joy)

The User Input mechanic serves as the primary controller for the real-time pixel sorting process, turning a static image into a responsive digital environment. The core interaction is mapped to the horizontal movement of the mouse. By moving the mouse along the x-axis, the user adjusts the brightness threshold of the sorting algorithm. Moving the mouse to the left lowers this threshold, allowing more pixels to break free and flow downward in long streaks. Moving it to the right increases the threshold, which stops the movement and stabilizes the image.

Beyond horizontal movement, the vertical y-axis of the mouse controls the length and intensity of these streaks, letting the user stretch the textures into deep, volcanic-like patterns. For further customization, pressing the C key on the keyboard cycles through different color gradients, shifting the visual mood from warm oranges to cool blues. This interactivity directly fulfills our project vision of creating a living artwork. Instead of watching a pre-recorded animation, the viewer actively shapes the geological flow, ensuring that the landscape is constantly shifting and never repeats itself.

---

### ⏱️ Time-Based Mechanic (Lihang)

For the time-based mechanic, I plan to use timers and gradual events to make the artwork feel like it is constantly breathing and transforming, even when the user is not directly interacting with it. The piece will move through slow visual cycles, where the pixel-sorted texture shifts between calm, unstable, and intense states. For example, every few seconds the sorting strength can increase, causing the vertical colour streaks to stretch downward like melting lava or digital rain. After reaching a peak, the distortion will slowly fade back into a quieter state before the next cycle begins.

This mechanic connects to our vision of turning a static pixel-sorted image into a living digital landscape. Time becomes the force that keeps the artwork alive. Instead of the image staying frozen, it gradually changes like geological movement, volcanic heat, or flowing magma. The user does not need to click or drag to experience this mechanic; they can simply watch the artwork evolve over time. This creates a sense of rhythm and anticipation, making the piece feel unstable, organic, and continuously in motion.

---

### 🎵 Audio Mechanic (Karina)

The system analyses incoming audio and measures its amplitude (overall loudness) and frequency content. These values combine with the user’s mouse movement to control the pixel-sorting effect. When the user drags the mouse across the screen, the selected area becomes active and begins to respond to the surrounding sound — much like how the surface of water responds to vibration.

When the audio is quiet, the pixels shift gently and the wave holds near its composed Hokusai form. As the sound grows louder, the dragged area surges and displaces horizontally, simulating the chaotic froth and spray at the crest of the wave. Low frequencies (bass) move larger masses of pixels, echoing the deep roll of the ocean’s body, while high frequencies generate finer, frothing detail at the edges — the white foam Hokusai rendered as delicate claws. This makes the image pulse in sync with both gesture and sound.

The mechanic connects directly to our vision: the artwork only surges after the user engages it, turning Hokusai’s static composition into a dynamic seascape shaped collaboratively by movement and audio.

---

### 🌊 Perlin Noise & Randomness (Adinata)

For my mechanic, I plan to use Perlin noise to create a sense of organic, undulating movement across the canvas — much like how ocean water swells, rolls, and churns naturally. Perlin noise generates smooth, continuous random values that are ideal for simulating the fluid, ever-shifting surface of the sea that Hokusai captured at its most extreme.

My idea is to use Perlin noise to control how the pixel-sorting effect flows across the canvas: some regions will feel like the deep, dark body of water beneath the wave, with subtle slow-drifting distortion; others will simulate the violent turbulence at the crest, with rapid, chaotic pixel movement. The colour gradients will also be noise-driven — shifting between the deep Prussian blue of the ocean, the pale grey-green of the wave's underside, and the white of the breaking foam, so the tones drift organically rather than in hard bands.

I will also incorporate a random seed so that the piece can reproduce the same starting state, while still feeling unpredictable as it flows. The user experiences this mechanic by simply watching. The artwork rewards patience, as it never quite repeats itself.

---

## Part 3: How the Mechanics Come Together

Each mechanic operates on a different axis of the artwork. Perlin noise defines the spatial seascape — sculpting which regions surge with turbulence and which hold in deep calm. Audio reshapes that seascape in real time, amplifying the wave wherever sound crests. Time drives the slow tidal cycle, building the wave from stillness to its peak and letting it recede, ensuring the piece never fully settles even in silence. User input layers personal agency on top, letting the viewer direct the current and steer the distortion like wind across the surface. Together they create a single coherent experience: Hokusai's frozen wave, now fluid, musical, cyclical, and responsive — a sea that never breaks the same way twice.
