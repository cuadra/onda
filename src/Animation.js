import { View } from "./Views.js";

export class Animation {
  #audioArray = new Uint8Array();
  #boom = 0;
  #lastTime = 0;
  #frameId = null;
  #acc = 0;
  #animating = true;
  #canvas = new View(document.querySelector("canvas"));
  constructor() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stop();
      } else {
        if (!audioElement.paused) {
          this.start();
        }
      }
    });
  }

  start() {
    this.#frameId = requestAnimationFrame(this.RenderFrame.bind(this));
  }
  stop() {
    cancelAnimationFrame(this.#frameId);
  }
  setAudioInfo(audioArray, bassValue) {
    this.#audioArray = audioArray;
    this.#boom = bassValue;
  }

  RenderFrame(time) {
    const dt = time - this.#lastTime;
    this.#lastTime = time;
    this.#acc = this.#acc + dt;

    if (this.#acc > 30) {
      this.#acc = 0;

      //this.#canvasContext.clearRect(0, 0, 150, 150);

      this.#canvas.Reset();
      this.#canvas.EQ(this.#audioArray);
      this.#canvas.Circle(this.#boom, 5, 15, "cyan", "white");
    }

    if (this.#animating) {
      this.#frameId = requestAnimationFrame(this.RenderFrame.bind(this));
    }
  }
}
