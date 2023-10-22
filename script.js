const c = new AudioContext();

//Master gain controls
const masterGain = c.createGain();
const masterGainBtn = document.getElementById("masterGain");

masterGain.gain.value = masterGainBtn.value;

masterGainBtn.addEventListener("input", () => {
  masterGain.gain.value = masterGainBtn.value;
});

masterGain.connect(c.destination);

//ADSR conotrols
const attackCtrl = document.getElementById("attack");
const decayCtrl = document.getElementById("decay");
const releaseCtrl = document.getElementById("release");

let attack = Number(attackCtrl.value);
let decay = Number(decayCtrl.value);
let release = Number(releaseCtrl.value);

attackCtrl.addEventListener("input", () => {
  attack = Number(attackCtrl.value);
});

decayCtrl.addEventListener("input", () => {
  decay = Number(decayCtrl.value);
});

releaseCtrl.addEventListener("input", () => {
  release = Number(releaseCtrl.value);
});

//Unison controls
const unisonVoicesCtrl = document.getElementById("unison-voices");
const unisonDetuneCtrl = document.getElementById("unison-detune");

let unisonVoices = Number(unisonVoicesCtrl.value);
let unisonDetune = Number(unisonDetuneCtrl.value);

unisonVoicesCtrl.addEventListener("input", () => {
  unisonVoices = Number(unisonVoicesCtrl.value);
});

unisonDetuneCtrl.addEventListener("input", () => {
  unisonDetune = Number(unisonDetuneCtrl.value);
});

//Waveform
const waveform = () => {
  return document.querySelector('input[name="waveform"]:checked').value;
};

//Scale / Transposing
const transposeDownBtn = document.getElementById("transposeDown");
const transposeUpBtn = document.getElementById("transposeUp");
const selectedScaleInput = document.getElementById("selectedScale");

transposeDownBtn.addEventListener("mousedown", () => {
  if (selectedScaleInput.value <= 0) {
  } else {
    selectedScaleInput.value -= 1;
  }
});

transposeUpBtn.addEventListener("mousedown", () => {
  if (selectedScaleInput.value >= 6) {
  } else {
    selectedScaleInput.value++;
  }
});

let selectedScale = () => {
  return Number(selectedScaleInput.value);
};

//Deals with keyboard presses
document.addEventListener("keydown", (key) => {
  const pressedKey = key.key.toLowerCase();

  //Gets frequency
  let noteRelatedToKey = () => {
    for (let element in keybinds) {
      if (keybinds[element].key === pressedKey) {
        return keybinds[element].note;
      }
    }
  };

  let frequencyRelatedToKey = () => {
    if (typeof noteRelatedToKey() === "undefined") {
    } else if (noteRelatedToKey()[2] === "-") {
      for (let element in frequencies) {
        if (
          frequencies[element].note[0] === noteRelatedToKey()[0] &&
          frequencies[element].note[1] === noteRelatedToKey()[1] &&
          frequencies[element].note[2] == selectedScale() + 1
        ) {
          return frequencies[element].freq;
        }
      }
    } else {
      for (let element in frequencies) {
        if (
          frequencies[element].note[0] === noteRelatedToKey()[0] &&
          frequencies[element].note[1] === noteRelatedToKey()[1] &&
          frequencies[element].note[2] == selectedScale()
        ) {
          return frequencies[element].freq;
        }
      }
    }
  };

  //Creates note
  if (typeof noteRelatedToKey() === "undefined") {
  } else {
    let now = c.currentTime;
    let duration = attack + decay + release;
    let gain = new GainNode(c);

    gain.connect(masterGain);

    let maxGainValueStages = [1.0, 0.65, 0.4, 0.3, 0.25, 0.2, 0.17, 0.14, 0.13];

    let oscList = new Array(unisonVoices);

    function createOsc() {
      const osc = new OscillatorNode(c, {
        frequency: frequencyRelatedToKey(),
        type: waveform(),
      });
      osc.connect(gain);
      osc.start();
      osc.stop(now + duration);
    }

    //Creates oscillators for the amount of voices selected
    let i = 0;

    while (i < oscList.length) {
      oscList[i] = createOsc();
      i++;
    }

    // oscList[0] = createOsc(0);
    // oscList[1] = createOsc(1 * unisonDetune);
    // oscList[2] = createOsc(1 * unisonDetune);
    // oscList[3] = createOsc(unisonDetune - 20);
    // oscList[4] = createOsc(unisonDetune + 10);
    // oscList[5] = createOsc(unisonDetune - 30);
    // oscList[6] = createOsc(unisonDetune + 20);
    // oscList[7] = createOsc(unisonDetune - 40);
    // oscList[8] = createOsc(unisonDetune + 30);

    //Attack, Delay, Release;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(
      maxGainValueStages[unisonVoices - 1],
      now + attack
    );
    gain.gain.linearRampToValueAtTime(
      maxGainValueStages[unisonVoices - 1] / 2,
      now + (attack + decay)
    );
    gain.gain.linearRampToValueAtTime(0, now + duration);
  }
});
