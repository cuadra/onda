let audioArray = [];
let animating = false;
let frameId = null;
let lastTime = 0;
let acc = 0;
const drawView = (time) => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  const dt = time - lastTime;
  lastTime = time;
  acc = acc + dt;
  if (acc > 30) {
    acc = 0;

    //ctx.clearRect(0, 0, 150, 150);
    ctx.reset();

    audioArray.forEach((v, i) => {
      const h = v;
      const width = 10;

      const x = i * width + 2 * i;

      const gradient = ctx.createLinearGradient(x, 100, x, 100 + h);
      gradient.addColorStop(0, "orange");
      gradient.addColorStop(0.2, "rgba(200, 0, 0, .5)");
      gradient.addColorStop(1, "rgba(200,0,0,0)");

      const gradient2 = ctx.createLinearGradient(x, 100, x, 100 - h);
      gradient2.addColorStop(0, "orange");
      gradient2.addColorStop(0.4, "rgba(200,0,0, 1)");

      ctx.fillStyle = gradient2;
      ctx.fillRect(x, 100, width, -h);
      ctx.fillStyle = gradient;
      ctx.fillRect(x, 100, width, h);
    });
  }

  if (animating) {
    frameId = requestAnimationFrame(drawView);
  }
};

(async function () {
  const context = new AudioContext();
  await context.audioWorklet.addModule("processor.js");

  const audio = document.querySelector("audio");
  const source = context.createMediaElementSource(audio);

  const tap = new AudioWorkletNode(context, "tap-processor");

  tap.port.onmessage = (e) => {
    const float32 = e.data;
    const pcm16 = new Int16Array(float32.length);
    const perc = new Uint8Array(float32.length);

    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      const p = pcm16[i] / 32768;
      perc[i] = Math.round(Math.abs(s) * 100); // roughly [-1, 1)
    }
    audioArray = perc;
    //console.log("Received audio block:", pcm16);
  };

  source.connect(tap).connect(context.destination);

  audio.addEventListener("ended", () => {
    animating = false;
    cancelAnimationFrame(frameId);
    context.close();
  });
  audio.addEventListener("pause", () => {
    animating = false;
    cancelAnimationFrame(frameId);
    context.suspend();
  });

  audio.addEventListener("play", () => {
    animating = true;
    frameId = requestAnimationFrame(drawView);
    context.resume();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      console.log("hidden");
      cancelAnimationFrame(frameId);
    } else {
      if (animating) {
        frameId = requestAnimationFrame(drawView);
      }
    }
  });
})();
