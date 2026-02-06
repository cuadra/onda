import { Colors } from "./Colors.js";

export class View {
  #canvas;
  #colors = [];
  #canvasSize = { w: 0, h: 0 };
  #canvasContext;
  #gap = 5;
  #posY = 0;
  #maxEQHeight = 400;
  constructor(canvas) {
    this.#canvas = canvas;
    this.#canvasContext = this.#canvas.getContext("2d");
    this.#canvasSize = {
      width: this.#canvas.width,
      height: this.#canvas.height,
    };
    this.#posY = this.#canvasSize.height / 2;

    const c = new Colors();
    this.#colors = c.CreateGradient(128, [
      { h: 200, s: 100, l: 60, a: 1 },
      { h: 290, s: 100, l: 60, a: 1 },
    ]);
  }

  Reset() {
    this.#canvasContext.reset();
  }
  getContext() {
    return this.#canvasContext;
  }
  Background() {
    const gradient = this.#canvasContext.createLinearGradient(
      0,
      0,
      this.#canvasSize.width,
      this.#canvasSize.height,
    );
    gradient.addColorStop(0, "rgba(26,26,26,1)");
    //#canvasSize = { width: window.innerWidth, height: window.innerHeight };
    gradient.addColorStop(1, "rgba(59,59,59,1)");
    this.#canvasContext.fillStyle = gradient;
    this.#canvasContext.fillRect(
      0,
      0,
      this.#canvasSize.width,
      this.#canvasSize.height,
    );
  }
  EQ(audioArray) {
    const totalGaps = this.#gap * (audioArray.length - 1);
    const width =
      (this.#canvasSize.width - totalGaps - this.#gap) / audioArray.length;

    audioArray.forEach((p, i) => {
      this.EQBar(width, this.#maxEQHeight, p, i);
    });
  }
  EQBar(width, maxHeight, percentage, index) {
    const h = percentage * 0.01;
    let height = h * maxHeight;
    const x = index * width + this.#gap * index + this.#gap;

    //const randomAlpha = Math.random() * 0.5 + 0.5;
    const randomAlpha = h > 0.8 ? 1 : h;

    const startY = this.#canvasSize.height / 2;

    const anchor = "s";

    let pos;
    let gradient;
    const min = 0;

    switch (anchor) {
      case "top":
        pos = { x: x, y: startY };
        gradient = this.#canvasContext.createLinearGradient(
          0,
          startY,
          0,
          Math.max(min, startY + height),
        );

        gradient.addColorStop(0, `rgba(255,255,255, 1)`);
        gradient.addColorStop(0.1, `rgba(248,191,255,1)`);
        gradient.addColorStop(0.28, `rgba(240,125,255, ${randomAlpha})`);
        gradient.addColorStop(1, `rgba(240,125,255,0)`);
        break;
      case "bottom":
        pos = { x: x, y: startY - height };
        gradient = this.#canvasContext.createLinearGradient(
          0,
          Math.max(startY - height, min),
          0,
          startY,
        );
        gradient.addColorStop(1, `rgba(255,255,255, 1)`);
        gradient.addColorStop(0.9, `rgba(248,191,255,1)`);
        gradient.addColorStop(0.82, `rgba(240,125,255, ${randomAlpha})`);
        gradient.addColorStop(0, `rgba(240,125,255,0)`);

        break;
      default:
        pos = { x: x, y: startY - height / 2 };
        gradient = this.#canvasContext.createLinearGradient(
          0,
          Math.max(startY - height / 2, min),
          0,
          Math.max(startY + height / 2, min),
        );
        gradient.addColorStop(0, `hsla(${this.#colors[index]} 100% 60% / 0)`);
        gradient.addColorStop(
          0.2,
          `hsla(${this.#colors[index]} 100% 60% / ${randomAlpha})`,
        );
        gradient.addColorStop(
          0.48,
          `hsla(${this.#colors[index]} 100% 60% / 1)`,
        );

        gradient.addColorStop(
          0.52,
          `hsla(${this.#colors[index]} 100% 60% / 1)`,
        );
        gradient.addColorStop(
          0.8,
          `hsla(${this.#colors[index]} 100% 60% / ${randomAlpha})`,
        );
        gradient.addColorStop(1, `hsla(${this.#colors[index]} 100% 60% / 0)`);
    }

    this.#canvasContext.fillStyle = gradient;
    this.#canvasContext.beginPath();
    this.#canvasContext.roundRect(x, pos.y, width, Math.max(min, height), 2);
    this.#canvasContext.fill();
  }
  Circle(boom, stroke, blur, color, accent) {
    let size = boom * 100;
    this.#canvasContext.beginPath();
    this.#canvasContext.arc(
      this.#canvasSize.width / 2,
      this.#canvasSize.height / 2 + 100,
      size,
      0,
      2 * Math.PI,
    );
    this.#canvasContext.lineWidth = stroke;
    this.#canvasContext.shadowColor = color;
    this.#canvasContext.shadowBlur = blur;
    this.#canvasContext.strokeStyle = boom === 1 ? accent : color;
    this.#canvasContext.stroke();
  }
}
