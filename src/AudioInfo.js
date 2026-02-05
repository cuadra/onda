import { Animation } from "./Animation.js";

export class AudioInfo {
  #animation = new Animation();
  #audioArray = new Uint8Array();
  #animating = false;
  #frameId = null;
  #lastTime = 0;
  #acc = 0;
  #boom = 0;
  #audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  #audio = null;
  #source = null;
  //bass options
  #bassFilter = null;
  #bassAnalyzer = null;
  #wave = null;
  //bass options
  #tap = null;
  #connected = false;
  constructor(audio) {
    this.#audio = audio;
  }

  async Start() {
    if (!this.#connected) {
      await this.loadWorklet("processor.js");
    }
    this.#connected = true;
    this.Resume();
  }
  Resume() {
    this.#animation.start();
    this.#audioCtx.resume();
  }
  Stop() {
    this.#animation.stop();
    this.#audioCtx.suspend();
  }
  Close() {
    this.#animation.stop();
    this.#audioCtx.close();
  }
  getAudioArray() {
    return this.#audioArray;
  }
  getBoom() {
    return this.#boom;
  }
  getAudioContext() {
    return this.#audioCtx;
  }

  async loadWorklet(processor) {
    await this.#audioCtx.audioWorklet.addModule(processor);

    //make sure its playing
    await this.#audioCtx.resume();

    this.#source = this.#audioCtx.createMediaElementSource(this.#audio);
    this.#bassFilter = this.#audioCtx.createBiquadFilter();
    this.#bassFilter.type = "lowpass";
    this.#bassFilter.frequency.value = 200;
    this.#bassAnalyzer = this.#audioCtx.createAnalyser();
    this.#bassAnalyzer.fftSize = 1024;
    this.#bassAnalyzer.smoothingTimeConstant = 0.8;
    this.#source.connect(this.#bassAnalyzer);
    this.#tap = new AudioWorkletNode(this.#audioCtx, "tap-processor");
    this.#source.connect(this.#tap).connect(this.#audioCtx.destination);
    this.#bassAnalyzer.connect(this.#audioCtx.destination);
    this.#wave = new Uint8Array(this.#bassAnalyzer.frequencyBinCount);

    this.#tap.port.onmessage = this.OnMessage;
  }

  OnMessage = (e) => {
    const float32 = e.data;
    const percentage = new Uint8Array(float32.length);

    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      percentage[i] = Math.round(Math.abs(s) * 100);
    }

    this.#audioArray = percentage;
    if (this.#bassAnalyzer && this.#wave) {
      this.#boom = this.getBassLevel(this.#bassAnalyzer, this.#wave);
    }
    this.#animation.setAudioInfo(this.#audioArray, this.#boom);
  };

  getBassLevel(analyzer, wave) {
    analyzer.getByteFrequencyData(wave);

    const sr = this.#audioCtx.sampleRate;
    const fftSize = analyzer.fftSize;
    const freqPerBin = sr / fftSize;

    const bassRange = [20, 250];

    const i0 = Math.floor(bassRange[0] / freqPerBin);
    const i1 = Math.ceil(bassRange[1] / freqPerBin);

    let sum = 0;

    for (let i = i0; i <= i1 && i < wave.length; i++) {
      sum += wave[i];
    }
    return sum / (Math.min(i1, wave.length - 1) - i0 + 1) / 255;
  }
}
