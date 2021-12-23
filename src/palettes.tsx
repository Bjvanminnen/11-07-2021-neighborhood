const palettes = require('nice-color-palettes/1000');
// const palettes: string[][] = [];
const custPalette = [
  '#613F75',
  '#c1ff9b',
  '#266dd3',
  '#00c2d1',
  '#f9e900',
  '#ff6542',
  '#ed33b9',
];
palettes.push(custPalette);

export function loadPalette(...indices: number[]) {
  const palette: string[] = [];
  indices.forEach(i => {
    palette.push(...palettes[i % palettes.length]);
  });
  return palette;
}

export function coolorPalette(palette: string): string[] {
  return palette.split('-').map(x => '#' + x);
}

export function toCoolor(palette: string[] | null) {
  if (!palette) {
    return '';
  }
  return palette
    .map(x =>
      x
        .split('')
        .slice(1)
        .join(''),
    )
    .join('-');
}
