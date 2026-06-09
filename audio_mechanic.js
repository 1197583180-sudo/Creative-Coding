// =====================================================
// AUDIO MECHANIC
// =====================================================

let splashSounds = [];

let sunSound;
let waveSound;

let sunAmp;

let waveFFT;

let waveHeightMultiplier = 1;
let sunGlowMultiplier = 1;

let bassEnergy = 0;
let midEnergy = 0;
let trebleEnergy = 0;

let audioButtonImg;
let audioPlaying = false;

const AUDIO_BTN_X    = 20;
const AUDIO_BTN_Y    = 20;
const AUDIO_BTN_SIZE = 70;

// -----------------------------------------------------

function preloadAudio() {
  soundFormats('mp3');

  audioButtonImg = loadImage('images/blue_music_button.png');
}
// -----------------------------------------------------

function drawAudioButton() {
  if (!audioButtonImg) return;
  push();
  tint(255, audioPlaying ? 255 : 160);
  image(audioButtonImg, AUDIO_BTN_X, AUDIO_BTN_Y, AUDIO_BTN_SIZE, AUDIO_BTN_SIZE);
  noTint();
  pop();
}

function isAudioButtonClick(mx, my) {
  return mx >= AUDIO_BTN_X && mx <= AUDIO_BTN_X + AUDIO_BTN_SIZE &&
         my >= AUDIO_BTN_Y && my <= AUDIO_BTN_Y + AUDIO_BTN_SIZE;
}

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

function setupAudioMechanic() {

  sunAmp = new p5.Amplitude();

  waveFFT = new p5.FFT(0.8, 1024);

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
        function () {
          console.log(path + ' loaded');
        },
        function (err) {
          console.error(path + ' failed', err);
        }
      )
    );
  }

  sunSound = loadSound(
    'audio/sun.mp3',
    function () {
      console.log('sun loaded');
      sunAmp.setInput(sunSound);
    },
    function (err) {
      console.error('sun failed', err);
    }
  );

  waveSound = loadSound(
    'audio/wave.mp3',
    function () {
      console.log('wave loaded');
      waveFFT.setInput(waveSound);
    },
    function (err) {
      console.error('wave failed', err);
    }
  );

  if (sunSound && sunSound.isLoaded()) {
    sunAmp.setInput(sunSound);
  }

  if (waveSound && waveSound.isLoaded()) {
    waveFFT.setInput(waveSound);
  }
}

// -----------------------------------------------------

function startAudioMechanic() {

  userStartAudio();

  const context = getAudioContext();

  if (context.state !== 'running') {
    context.resume();
  }

  if (sunSound && sunSound.isLoaded()) {

    if (!sunSound.isPlaying()) {
      sunSound.setVolume(1);
      sunSound.loop();
    }

  } else {
    console.error('sun not loaded');
  }

  if (waveSound && waveSound.isLoaded()) {

    if (!waveSound.isPlaying()) {
      waveSound.setVolume(1);
      waveSound.loop();
    }

  } else {
    console.error('wave not loaded');
  }

  console.log(
    'audio states:',
    sunSound && sunSound.isPlaying(),
    waveSound && waveSound.isPlaying()
  );
}

// -----------------------------------------------------

function updateAudioMechanic() {

  if (!sunSound || !waveSound) {
    return;
  }

  let sunLevel = sunAmp.getLevel();

  sunGlowMultiplier =
    map(
      sunLevel,
      0,
      0.3,
      0.7,
      3.0,
      true
    );

  waveFFT.analyze();

  bassEnergy = waveFFT.getEnergy("bass");
  midEnergy = waveFFT.getEnergy("mid");
  trebleEnergy = waveFFT.getEnergy("treble");

  waveHeightMultiplier =
    map(
      bassEnergy,
      0,
      255,
      0.9,
      1.25,
      true
    );
}
