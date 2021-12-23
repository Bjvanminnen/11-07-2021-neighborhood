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
    season: pickOption(['winter', 'autumn', 'spring'], [0.7, 0.2, 0.1], rng()),
    density: pickOption(['standard', 'dense'], [0.75, 0.25], rng()),
    speed: pickOption(['standard', 'fast', 'slow'], [0.65, 0.3, 0.05], rng()),
    dot: pickOption(['standard', 'small', 'big'], [0.5, 0.4, 0.1], rng()),
  };

  if (features.speed === 'fast' && features.dot === 'small') {
    features.dot = 'standard';
  }

  return features;
}
