
export const getIndicesOfChar = (char: string, str: string): number[] => {
  const indices: number[] = [];
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === char) indices.push(i);
  }
  return indices;
};
