import AudioInfo from "./audioInfo.js";
import View from "./View.js";
import Animation from "./Animation.js";

const audioElement = document.querySelector("audio");
const ai = new AudioInfo(audioElement);
const animation = new Animation();

const canvas = new View(document.querySelector("canvas"));

ai.loadWorklet("processor.js");

audioElement.addEventListener("play", () => {
  animation.start();
  ai.getAudioContext().resume();
});

audioElement.addEventListener("pause", () => {
  animation.stop();
  ai.getAudioContext().suspend();
});
audioElement.addEventListener("ended", () => {
  animation.stop();
  ai.getAudioContext().close();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    animation.stop();
  } else {
    if (!audioElement.paused) {
      animation.start();
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  canvas = document.querySelector("canvas");
  canvas.setAttribute("width", window.innerWidth);
  canvas.setAttribute("height", window.innerHeight);
});
