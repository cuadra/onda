export class View {
  #canvas;
  #canvasSize = { w: 0, h: 0 };
  #canvasContext;
  #gap = 5;
  #posY = 0;
  #maxEQHeight = 400;
  constructor(canvas) {
    this.#canvas = canvas;
    this.#canvasContext = this.#canvas.getContext("2d");
  }

  setSize(width, height) {
    this.#canvasSize = { w: width, h: height };
    this.#posY = this.#canvasSize.height / 2;
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
    gradient.addColorStop(0, "rgba(40,36,97,1)");
    gradient.addColorStop(1, "rgba(28,28,69,1)");
    this.#canvasContext.fillStyle = gradient;
    this.#canvasContext.fillRect(
      0,
      0,
      this.#canvasSize.width,
      this.#canvasSize.height,
    );
  }
  EQ(length) {
    const totalGaps = this.#gap * (length - 1);
    const width = (this.#canvasSize.width - totalGaps) / length;

    audioArray.forEach((p, i) => {
      EQBar(width, this.#maxEQHeight, p, i);
    });
  }
  EQBar(width, maxHeight, percentage, index) {
    const h = percentage * 0.01;
    const height = h * maxHeight;
    const x = index * width + this.#gap * index;

    //const randomAlpha = Math.random() * 0.5 + 0.5;
    const randomAlpha = h > 0.8 ? 1 : h;

    const gradient = this.#canvasContext.createLinearGradient(
      x,
      this.#posY - height,
      x,
      this.#posY,
    );

    gradient.addColorStop(0, `rgba(240,125,255,0)`);
    gradient.addColorStop(0.8, `rgba(240,125,255, ${randomAlpha})`);
    gradient.addColorStop(0.98, `rgba(248,191,255,1)`);
    gradient.addColorStop(1, `rgba(255,255,255, 1)`);

    this.#canvasContext.fillStyle = gradient;

    this.#canvasContext.beginPath();
    this.#canvasContext.roundRect(
      x,
      this.#posY - height,
      width,
      height,
      [5, 5, 2, 2],
    );
    this.#canvasContext.fill();
  }
  Circle(boom, stroke, blur, color, accent) {
    let size = boom * 70;
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
