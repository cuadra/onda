export class Animation {
  #lastTime = 0;
  #frameId = null;
  #acc = 0;
  #animating = true;

  constructor() {}

  start() {
    this.#frameId = requestAnimationFrame(this.RenderFrame);
  }
  stop() {
    cancelAnimationFrame(this.#frameId);
  }

  RenderFrame(time) {
    const dt = time - lastTime;
    this.#lastTime = time;
    this.#acc = this.#acc + dt;

    if (this.#acc > 30) {
      this.#acc = 0;

      //this.#canvasContext.clearRect(0, 0, 150, 150);
      slide.getContext().reset();

      slide.EQ(audioArray.length);
      slide.Circle(boom, 5, 15, "cyan", "white");
    }

    if (this.#animating) {
      frameId = requestAnimationFrame(this.RenderFrame);
    }
  }
}
