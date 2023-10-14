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

//Listens for keyboard presses, changes button's background-color while key is pressed

const c = new AudioContext();
let osc;

document.addEventListener("keydown", (key) => {
  const pressedKey = key.key;

  for (let note of notes) {
    if (pressedKey === note.keybind) {
      osc = c.createOscillator();
      osc.frequency.value = note.freq;
      osc.connect(c.destination);
      osc.start();

      document.querySelector(
        '[data-keybind="' + pressedKey + '"]'
      ).style.backgroundColor = "red";
    }
  }
  document.addEventListener("keyup", () => {
    for (let note of notes) {
      if (pressedKey === note.keybind) {
        const currentKey = document.querySelector(
          '[data-keybind="' + pressedKey + '"]'
        );

        osc.stop();

        if (currentKey.className === "black-key keyboard-key") {
          currentKey.style.backgroundColor = "#242424";
        } else {
          currentKey.style.backgroundColor = "white";
        }
      }
    }
  });
});
