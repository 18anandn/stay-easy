export const getNumberOfLines = (pElem: HTMLParagraphElement): number => {
  const rects = pElem.getClientRects();
  let lines = 0;
  for (let i = 0; i < rects.length; i++) {
    if (rects[i - 1]) {
      if (rects[i - 1].y !== rects[i].y) {
        lines++;
      }
    } else {
      lines++;
    }
  }
  return lines;
};
