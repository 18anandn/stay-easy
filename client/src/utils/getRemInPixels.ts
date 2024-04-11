export const getRemInPixels = (rem: number) =>
  rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
