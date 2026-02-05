class TapProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.counter = 0;
  }
  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    if (!input || input.length === 0) return true;

    // Copy each channel through so audio remains audible
    for (let ch = 0; ch < output.length; ch++) {
      const inCh = input[ch] || input[0]; // fallback if mono input
      const outCh = output[ch];

      if (inCh && outCh) outCh.set(inCh);
    }

    // If you want to analyze, post a COPY (not the original buffer)

    if (this.counter++ % 60 === 0) {
      this.port.postMessage(input[0].slice());
    }

    return true;
  }
}

registerProcessor("tap-processor", TapProcessor);
