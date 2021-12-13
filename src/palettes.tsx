const palettes = require('nice-color-palettes/1000');
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

export function loadPalette(index: number) {
  return palettes[index % palettes.length];
}
