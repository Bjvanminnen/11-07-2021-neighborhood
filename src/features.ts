function pickOption(options: any[], freqs: number[], val: number) {
  if (options.length !== freqs.length) {
    throw new Error('options and freqs of different lengths');
  }

  const freqSums = freqs.reduce(
    (sums: number[], cur) => sums.concat((sums[sums.length - 1] ?? 0) + cur),
    [],
  );
  if (Math.abs(freqSums[freqSums.length] - 1) > 0.0000001) {
    throw new Error('freqs dont add up');
  }

  for (let i = 0; i < freqSums.length; i++) {
    if (val <= freqSums[i]) {
      return options[i];
    }
  }
}

export default function generateFeatures(rng: () => number) {
  const features = {
    // TODO: might rename to something like theme?
    theme: pickOption(
      ['retro', 'earthworm', 'mint'],
      [0.33, 0.33, 0.33],
      rng(),
    ),
    density: pickOption(
      ['standard', 'clustered', 'dense'],
      [0.5, 0.4, 0.1],
      rng(),
    ),
    speed: pickOption(['standard', 'fast', 'slow'], [0.65, 0.3, 0.05], rng()),
    dot: pickOption(['standard', 'small', 'big'], [0.5, 0.3, 0.2], rng()),
  };

  if (features.speed === 'fast' && features.dot === 'small') {
    features.dot = 'standard';
  }

  return features;
}
