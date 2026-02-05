import { AudioInfo } from "./AudioInfo.js";

document.addEventListener("DOMContentLoaded", () => {
  const audioElement = document.querySelector("audio");
  const canvasElm = document.querySelector("canvas");
  canvasElm.setAttribute("width", window.innerWidth);
  canvasElm.setAttribute("height", window.innerHeight);
  const ai = new AudioInfo(audioElement);

  audioElement.addEventListener("play", async () => {
    ai.Start();
  });

  audioElement.addEventListener("pause", () => {
    ai.Stop();
  });
  audioElement.addEventListener("ended", () => {
    ai.Close();
  });
});
