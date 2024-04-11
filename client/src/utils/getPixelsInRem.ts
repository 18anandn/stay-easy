export const getPixelsInRem = (pixels: number) =>
  pixels / parseFloat(getComputedStyle(document.documentElement).fontSize);
