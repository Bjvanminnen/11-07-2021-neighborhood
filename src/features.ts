function pickOption<T>(options: T[], freqs: number[], val: number): T {
  if (options.length !== freqs.length) {
    throw new Error('options and freqs of different lengths');
  }

  const freqSums = freqs.reduce(
    (sums: number[], cur) => sums.concat((sums[sums.length - 1] ?? 0) + cur),
    [],
  );
  if (Math.abs(freqSums[freqSums.length - 1] - 1) > 0.0000001) {
    throw new Error('freqs dont add up');
  }
  for (let i = 0; i < freqSums.length; i++) {
    if (val <= freqSums[i]) {
      return options[i];
    }
  }
  return options[options.length - 1];
}

enum Theme {
  synthwave = 'synthwave',
  earthworm = 'earthworm',
  toothpaste = 'toothpaste',
  compostable = 'compostable',
}

export enum Density {
  standard = 'standard',
  clustered = 'clustered',
  dense = 'dense',
}
export enum Speed {
  standard = 'standard',
  fast = 'fast',
  slow = 'slow',
}
export enum Dot {
  standard = 'standard',
  big = 'big',
}

export default function generateFeatures(rng: () => number) {
  const features: { theme: Theme; density: Density; speed: Speed; dot: Dot } = {
    theme: pickOption(
      [Theme.synthwave, Theme.earthworm, Theme.toothpaste, Theme.compostable],
      [0.35, 0.15, 0.3, 0.2],
      rng(),
    ),
    density: pickOption(
      [Density.standard, Density.clustered, Density.dense],
      [0.5, 0.35, 0.15],
      rng(),
    ),
    speed: pickOption(
      [Speed.standard, Speed.fast, Speed.slow],
      [0.65, 0.3, 0.05],
      rng(),
    ),
    dot: pickOption([Dot.standard, Dot.big], [0.6, 0.4], rng()),
  };

  // Big dots for most earthworms
  if (features.theme === Theme.earthworm) {
    features.dot = rng() < 0.1 ? Dot.standard : Dot.big;
  }
  return features;
}
