# IDEA9103: Creative Coding Group Project

**University of Sydney** | IDEA9103 Creative Coding
**Team:** Joy, Lihang, Karina, Adinata

---

## Part 1: Project Direction

### Artwork We Are Reinterpreting

Our project reinterprets **"Sorted: 12 Pixel Sorted Textures"** by Mark Walczak and Jim LePage ([Chroma Supply, 2022](https://chromasupply.co)), a series of pixel-sorted digital textures defined by vertical colour streaks, volcanic interruptions, and organic gradients that flow from deep orange through purple into cool blue.

Our second inspiration is **Kim Asendorf's "Mountain Tour"** (2010), the pioneering pixel sorting series that directly influenced Walczak and LePage's work. Asendorf's algorithm, which selects and reorders pixels by brightness along columns, is the foundational technique we build upon.

![Sorted by Mark Walczak and Jim LePage](images/sorted.jpg)

![Kim Asendorf Mountain Tour 2010](images/mountain-tour.jpg)

### Vision

We reinterpret *Sorted* by transforming its static frozen texture into a living, reactive artwork built in p5.js. Inspired by Kim Asendorf's *Mountain Tour*, which pioneered pixel sorting as an artistic method, and Walczak and LePage's application of it to abstract volcanic textures, our version breathes life into the geological depth already latent in the original. Audio drives the intensity of the sorting effect; time governs slow, rhythmic cycles of change; Perlin noise sculpts organic boundaries and colour gradients that drift like magma; and user input gives the viewer direct agency over the experience. Together, these four mechanics transform a still image into something that feels geological, alive, and ever-shifting, like a landscape that never quite repeats itself.

---

## Part 2: Individual Mechanics

### 🖱️ User Input (Joy)

> [Joy to fill in their own description. Aim for 100+ words covering: what this mechanic does, how the user interacts with it (mouse, keyboard, or other input), and how it connects to the vision of a living, reactive pixel-sorted artwork.]

<!-- Joy: add a sketch or diagram image here using the format below -->
<!-- ![Joy's mechanic sketch](images/joy-sketch.jpg) -->

---

### ⏱️ Time-Based Mechanic (Lihang)

> [Lihang to fill in their own description. Aim for 100+ words covering: what this mechanic does, how timers and scheduled events are used, and how it connects to the vision of rhythmic, cyclical change in the artwork.]

<!-- Lihang: add a sketch or diagram image here using the format below -->
<!-- ![Lihang's mechanic sketch](images/lihang-sketch.jpg) -->

---

### 🎵 Audio Mechanic (Karina)

The system analyses the incoming audio and measures its amplitude (overall loudness) and frequency content. These values are combined with the user’s mouse movement to control the pixel-sorting effect. When the user drags the mouse across the screen, the selected area becomes active and begins to respond to the surrounding sound rather than reacting automatically from the start.

When the audio is quiet, the pixels shift gently and remain mostly stable. As the sound becomes louder, the dragged area stretches and displaces horizontally, creating a stronger glitch-like distortion. Low frequencies (bass) move larger groups of pixels, while high frequencies generate finer and more detailed textures. This makes the image pulse and shimmer in sync with both the user’s gestures and the live audio input.

The mechanic connects directly to the project vision by combining human interaction with sound-responsive visuals. The artwork only comes alive after the user touches and drags across the image, turning the static pixel-sorted composition into a dynamic texture shaped collaboratively by movement and audio.

---

### 🌊 Perlin Noise & Randomness (Adinata)

For my mechanic, I plan to use Perlin noise to create a sense of depth and organic movement across the canvas, much like how molten lava flows and breathes naturally. From what I have learned this week, Perlin noise generates smooth, natural-looking random values, which feels perfect for recreating the volcanic and fluid qualities already present in the original *Sorted* artwork by Mark Walczak and Jim LePage.

My idea is to use Perlin noise to control how the colours shift across the canvas and how deep the pixel sorting effect goes in different regions, creating an illusion of layers where some areas feel close and glowing, and others feel dark and deep. Over time, these regions will slowly drift and evolve, making the piece feel like a living, biological liquid rather than a static image.

I will also incorporate a random seed so that the piece can reproduce the same starting state, while still feeling unpredictable as it flows. The user experiences this mechanic by simply watching. The artwork rewards patience, as it never quite repeats itself.

<!-- Adinata: add a sketch or diagram image here using the format below -->
<!-- ![Adinata's mechanic sketch](images/adinata-sketch.jpg) -->

---

## Part 3: How the Mechanics Come Together

Each mechanic operates on a different axis of the artwork. Perlin noise defines the spatial landscape, controlling which regions are bright, deep, or in flux. Audio reshapes that landscape in real time, amplifying the sorting effect wherever sound peaks. Time drives slow background cycles, ensuring the piece never settles even in silence. User input layers personal agency on top, letting the viewer redirect or intensify the whole system. Together they create a single coherent experience: a pixel-sorted texture that is simultaneously geological, musical, cyclical, and responsive.
