export class Colors {
  constructor() {}

  CreateGradient(spread, colors) {
    const spectrum = [];

    for (let i = 0; i < colors.length; i++) {
      const currentColor = colors[i];
      const nextColor = colors[i + 1 > colors.length - 1 ? 0 : i + 1];
      spectrum.push(
        this.CreateDualToneGradient(spread / colors.length, [
          currentColor,
          nextColor,
        ]),
      );
    }
    return spectrum.flat();
  }

  CreateDualToneGradient(spread, colors) {
    const spectrum = [];

    let diff = colors[1].h - colors[0].h;

    for (let i = 0; i < spread; i++) {
      const color =
        i === spread - 1
          ? colors[1].h
          : colors[0].h + Math.round((diff / spread) * i);

      spectrum.push(color);
    }
    return spectrum;
  }
}
