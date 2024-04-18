export const generateNComponents = (
  n: number,
  comp: JSX.Element
): JSX.Element[] => {
  const arr: JSX.Element[] = [];
  for (let i = 1; i <= n; i++) {
    arr.push(comp);
  }

  return arr;
};
