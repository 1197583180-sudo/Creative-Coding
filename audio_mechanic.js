// =====================================================
// AUDIO MECHANIC — Karina Zhu
// Connects two music tracks to the visuals so the waves and sun react to sound.
// AI-assisted: this file was developed with the help of Claude Code (claude-sonnet-4-6, Anthropic).
// AI assistance was used for the p5.FFT frequency analysis, amplitude-to-multiplier mapping,
// and the sunGlowMultiplier / waveHeightMultiplier shared global variable pattern.
// =====================================================

// Stores the four short splash sound effects played when fish jump.
let splashSounds = [];

// The two main background music tracks.
let sunSound;   // ambient sun track — controls how brightly the sun glows
let waveSound;  // ambient wave track — controls how tall the waves get

// Measures the overall loudness of the sun track each frame.
let sunAmp;

// Breaks the wave track into frequency bands (bass, mid, treble) each frame.
let waveFFT;

// These two values are read by other mechanic files every frame.
// waveHeightMultiplier — scales how tall all the waves are (1 = normal, higher = taller)
// sunGlowMultiplier    — scales how bright and how far the sun rays and rings extend
let waveHeightMultiplier = 1;
let sunGlowMultiplier = 1;

// The energy level of each frequency band, updated every frame from the wave track FFT.
let bassEnergy   = 0;  // low frequencies (kick drum, bass)
let midEnergy    = 0;  // mid frequencies (vocals, rhythm)
let trebleEnergy = 0;  // high frequencies (hi-hats, brightness)

// The audio toggle button shown in the top-left corner of the canvas.
let audioButtonImg;
let audioPlaying = false; // tracks whether music is currently playing

// Position and size of the audio button on screen (in screen pixels, not design coords).
const AUDIO_BTN_X    = 20;
const AUDIO_BTN_Y    = 20;
const AUDIO_BTN_SIZE = 70;

// -----------------------------------------------------

// Loads the audio button image before the sketch starts.
function preloadAudio() {
  soundFormats('mp3');
  audioButtonImg = loadImage('images/blue_music_button.png');
}

// -----------------------------------------------------

// Draws the audio toggle button. Dims it slightly when audio is off.
function drawAudioButton() {
  if (!audioButtonImg) return;
  push();
  tint(255, audioPlaying ? 255 : 160); // full opacity when playing, dimmed when stopped
  image(audioButtonImg, AUDIO_BTN_X, AUDIO_BTN_Y, AUDIO_BTN_SIZE, AUDIO_BTN_SIZE);
  noTint();
  pop();
}

// Returns true if the given screen coordinates are inside the audio button area.
function isAudioButtonClick(mx, my) {
  return mx >= AUDIO_BTN_X && mx <= AUDIO_BTN_X + AUDIO_BTN_SIZE &&
         my >= AUDIO_BTN_Y && my <= AUDIO_BTN_Y + AUDIO_BTN_SIZE;
}

// Starts or stops audio depending on whether it is currently playing.
function toggleAudioMechanic() {
  if (audioPlaying) {
    if (sunSound)  sunSound.stop();
    if (waveSound) waveSound.stop();
    audioPlaying = false;
  } else {
    startAudioMechanic();
    audioPlaying = true;
  }
}

// -----------------------------------------------------

// Loads all audio files and sets up the analyser tools.
// Called once in setup() before the sketch starts drawing.
function setupAudioMechanic() {

  // p5.Amplitude measures how loud a sound is at any moment (0 = silent, 1 = loud).
  sunAmp = new p5.Amplitude();

  // p5.FFT splits audio into frequency bands so we know how much bass, mid, and treble is playing.
  // 0.8 is the smoothing level (higher = smoother changes), 1024 is the resolution.
  waveFFT = new p5.FFT(0.8, 1024);

  // Load the four splash sound files used when fish jump out of the water.
  const splashPaths = [
    'audio/splash.mp3',
    'audio/splash2.mp3',
    'audio/splash3.mp3',
    'audio/splash4.mp3'
  ];

  for (let i = 0; i < splashPaths.length; i++) {
    const path = splashPaths[i];
    splashSounds.push(
      loadSound(
        path,
        function () { console.log(path + ' loaded'); },
        function (err) { console.error(path + ' failed', err); }
      )
    );
  }

  // Load the sun ambient track and connect it to the amplitude analyser.
  sunSound = loadSound(
    'audio/sun.mp3',
    function () {
      console.log('sun loaded');
      sunAmp.setInput(sunSound); // tells sunAmp to measure this specific track
    },
    function (err) { console.error('sun failed', err); }
  );

  // Load the wave ambient track and connect it to the FFT analyser.
  waveSound = loadSound(
    'audio/wave.mp3',
    function () {
      console.log('wave loaded');
      waveFFT.setInput(waveSound); // tells waveFFT to analyse this specific track
    },
    function (err) { console.error('wave failed', err); }
  );

  // Fallback: connect analysers if sounds were already loaded before the callback fired.
  if (sunSound && sunSound.isLoaded())   sunAmp.setInput(sunSound);
  if (waveSound && waveSound.isLoaded()) waveFFT.setInput(waveSound);
}

// -----------------------------------------------------

// Starts both music tracks looping. Called when the user clicks the audio button.
function startAudioMechanic() {

  // Required by browsers: audio can only start after a user interaction (click/tap).
  userStartAudio();

  // Resume the audio context if the browser suspended it automatically.
  const context = getAudioContext();
  if (context.state !== 'running') {
    context.resume();
  }

  if (sunSound && sunSound.isLoaded()) {
    if (!sunSound.isPlaying()) {
      sunSound.setVolume(1);
      sunSound.loop(); // play on repeat
    }
  } else {
    console.error('sun not loaded');
  }

  if (waveSound && waveSound.isLoaded()) {
    if (!waveSound.isPlaying()) {
      waveSound.setVolume(1);
      waveSound.loop(); // play on repeat
    }
  } else {
    console.error('wave not loaded');
  }
}

// -----------------------------------------------------

// Runs every frame. Reads the current audio levels and updates the shared multipliers
// that other mechanic files use to scale the waves and sun glow.
function updateAudioMechanic() {

  // Do nothing if audio hasn't loaded yet.
  if (!sunSound || !waveSound) return;

  // Read the sun track's current loudness and map it to a sun glow strength.
  // A quiet sun track (level ~0) gives a multiplier of 0.7 (slightly dimmer than normal).
  // A loud sun track (level ~0.3) gives a multiplier of 3.0 (much brighter and bigger rays).
  let sunLevel = sunAmp.getLevel();
  sunGlowMultiplier = map(sunLevel, 0, 0.3, 0.7, 3.0, true);

  // Analyse the wave track and split it into three frequency bands.
  waveFFT.analyze();
  bassEnergy   = waveFFT.getEnergy("bass");    // 0–255, how much low-end energy
  midEnergy    = waveFFT.getEnergy("mid");     // 0–255, how much mid-range energy
  trebleEnergy = waveFFT.getEnergy("treble");  // 0–255, how much high-end energy

  // Map the bass level to an overall wave height multiplier.
  // Strong bass (255) makes waves 25% taller; no bass keeps them at 90% height.
  waveHeightMultiplier = map(bassEnergy, 0, 255, 0.9, 1.25, true);
}
