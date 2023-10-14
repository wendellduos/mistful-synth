const octaveFreqs = [
  [
    261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.0, 415.3, 440.0,
    466.16, 493.88, 523.25, 554.37, 587.33, 622.25, 659.25,
  ],
];

const notes = [
  { name: "c-4", freq: 261.63, keybind: "z" },
  { name: "c#4", freq: 277.18, keybind: "s" },
  { name: "d-4", freq: 293.66, keybind: "x" },
  { name: "d#4", freq: 311.13, keybind: "d" },
  { name: "e-4", freq: 329.63, keybind: "c" },
  { name: "f-4", freq: 349.23, keybind: "v" },
  { name: "f#4", freq: 369.99, keybind: "g" },
  { name: "g-4", freq: 392.0, keybind: "b" },
  { name: "g#4", freq: 415.3, keybind: "h" },
  { name: "a-4", freq: 440.0, keybind: "n" },
  { name: "a#4", freq: 466.16, keybind: "j" },
  { name: "b-4", freq: 493.88, keybind: "m" },
  { name: "c-5", freq: 523.25, keybind: "," },
  { name: "c#5", freq: 554.37, keybind: "l" },
  { name: "d-5", freq: 587.33, keybind: "." },
  { name: "d#5", freq: 622.25, keybind: "ç" },
  { name: "e-5", freq: 659.25, keybind: ";" },
];

//Adds buttons for each key in DOM
notes.forEach((note) => {
  const keyboardKeysSection = document.getElementById("keyboard-keys");

  if (note.name[1] === "#") {
    keyboardKeysSection.innerHTML += `<button class="black-key keyboard-key" data-note="${note.name}" data-keybind="${note.keybind}">${note.name}</button>`;
  } else {
    keyboardKeysSection.innerHTML += `<button class="white-key keyboard-key" data-note="${note.name}" data-keybind="${note.keybind}">${note.name}</button>`;
  }
});

//Gets parameters selected in DOM
// * Improve master volume behavior. Needs to work at any given moment
const masterVolume = () => {
  return document.getElementById("master-volume").value;
};

const selectedWaveform = () => {
  return document.querySelector('input[name="waveform"]:checked').value;
};

//Initiates audio node
const c = new AudioContext();
let osc;
let gain;

//Listens for keyboard presses, changes button's background-color while key is pressed

document.addEventListener("keydown", (key) => {
  const pressedKey = key.key;

  for (let note of notes) {
    if (pressedKey === note.keybind) {
      playNote(note.freq);

      document.querySelector(
        '[data-keybind="' + pressedKey + '"]'
      ).style.backgroundColor = "var(--pressed-key)";
    }
  }
  document.addEventListener("keyup", () => {
    for (let note of notes) {
      if (pressedKey === note.keybind) {
        stopNote();

        const currentKey = document.querySelector(
          '[data-keybind="' + pressedKey + '"]'
        );

        if (currentKey.className === "black-key keyboard-key") {
          currentKey.style.backgroundColor = "var(--black-key)";
        } else {
          currentKey.style.backgroundColor = "var(--white-key)";
        }
      }
    }
  });
});

function playNote(keyFreq) {
  gain = c.createGain();
  gain.gain.value = masterVolume();
  gain.connect(c.destination);

  osc = c.createOscillator();
  osc.type = selectedWaveform();
  osc.frequency.value = keyFreq;
  osc.connect(gain);
  osc.start();
}

function stopNote() {
  osc.stop();
}
