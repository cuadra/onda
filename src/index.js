let audioArray = [];
let animating = false;
let frameId = null;
let lastTime = 0;
let acc = 0;
let boom = 0;
const canvas = document.querySelector("canvas");
let canvasSize = { width: canvas.width, height: canvas.height };

const ctx = canvas.getContext("2d");

const eq = (type, width, gap) => {
  const posY = canvasSize.height / 2;
  const maxHeight = 400;
  audioArray.forEach((v, i) => {
    const h = v * 0.01;
    const height = h * maxHeight;
    const x = i * width + gap * i;

    //const randomAlpha = Math.random() * 0.5 + 0.5;
    const randomAlpha = h > 0.8 ? 1 : h;

    const gradient2 = ctx.createLinearGradient(x, posY - height, x, posY);

    gradient2.addColorStop(0, `rgba(240,125,255,${0})`);
    gradient2.addColorStop(0.8, `rgba(240,125,255, ${randomAlpha})`);
    gradient2.addColorStop(0.98, `rgba(248,191,255,1)`);

    gradient2.addColorStop(1, `rgba(255,255,255, 1)`);

    ctx.fillStyle = gradient2;

    ctx.beginPath();
    ctx.roundRect(x, posY - height, width, height, [5, 5, 2, 2]);
    ctx.fill();
  });
};
const circle = (stroke, blur, color, accent) => {
  let size = boom * 70;

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2 + 100, size, 0, 2 * Math.PI);
  ctx.lineWidth = stroke;
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.strokeStyle = boom === 1 ? accent : color;
  ctx.stroke();
};
const updateBackground = () => {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "rgba(40,36,97,1)");
  gradient.addColorStop(1, "rgba(28,28,69,1)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
const drawView = (time) => {
  const dt = time - lastTime;
  lastTime = time;
  acc = acc + dt;
  if (acc > 30) {
    acc = 0;

    //ctx.clearRect(0, 0, 150, 150);
    ctx.reset();
    const gap = 5;
    const barsNo = audioArray.length;
    const totalGaps = gap * (barsNo - 1);

    const barWidth = (canvasSize.width - totalGaps) / barsNo;

    //eq("blur", barWidth, gap);
    //updateBackground();
    eq("standard", barWidth, gap);
    circle(boom > 0.95 ? 5 : 4, boom > 0.95 ? 15 : 10, "cyan", "white");
  }

  if (animating) {
    frameId = requestAnimationFrame(drawView);
  }
};

function bassLevel(bassAnalyser, wave, context) {
  bassAnalyser.getByteFrequencyData(wave);

  const sr = context.sampleRate;
  const fftSize = bassAnalyser.fftSize;
  const freqPerBin = sr / fftSize;

  const bassLow = 20;
  const bassHigh = 250;

  const i0 = Math.floor(bassLow / freqPerBin);
  const i1 = Math.ceil(bassHigh / freqPerBin);

  let sum = 0;
  for (let i = i0; i <= i1 && i < wave.length; i++) sum += wave[i];
  const avg = sum / (i1 - i0 + 1);

  return avg / 255;
}

(async function () {
  const context = new AudioContext();
  await context.audioWorklet.addModule("processor.js");

  const audio = document.querySelector("audio");
  const source = context.createMediaElementSource(audio);

  //for bass
  const bassFilter = context.createBiquadFilter(audio);

  bassFilter.type = "lowpass";

  bassFilter.frequency.value = 250;

  const bassAnalyzer = context.createAnalyser();
  bassAnalyzer.fftSize = 1024;
  bassAnalyzer.smoothingTimeConstant = 0.8;

  source.connect(bassAnalyzer);
  bassAnalyzer.connect(context.destination);

  const wave = new Uint8Array(bassAnalyzer.frequencyBinCount);

  //for bass

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
    boom = bassLevel(bassAnalyzer, wave, context);
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
document.addEventListener("DOMContentLoaded", () => {
  canvas.setAttribute("width", window.innerWidth);
  canvas.setAttribute("height", window.innerHeight);
  canvasSize = { width: canvas.width, height: canvas.height };
});
