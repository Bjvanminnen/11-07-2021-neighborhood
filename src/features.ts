// possible features:
// - colors
// - initial density
// - speed?
// - dot size?

type season = 'winter' | 'autumn' | 'spring';
function pickSeason(val: number): season {
  if (val < 0.7) {
    return 'winter';
  }

  if (val < 0.9) {
    return 'autumn';
  }
  return 'spring';
}

export default function generateFeatures(rng: () => number) {
  return {
    season: pickSeason(rng()),
  };
}
