// =====================================================
// AUDIO MECHANIC
// =====================================================

let sunSound;
let waveSound;

let sunAmp;

let waveFFT;

let waveHeightMultiplier = 1;
let sunGlowMultiplier = 1;

let bassEnergy = 0;
let midEnergy = 0;
let trebleEnergy = 0;

// -----------------------------------------------------

function preloadAudio() {

  soundFormats('mp3');
}

// -----------------------------------------------------

function setupAudioMechanic() {

  sunAmp = new p5.Amplitude();

  waveFFT = new p5.FFT(0.8, 1024);

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
