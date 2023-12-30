let counter = 0;

export const sampler = <T>(
  arr: T[],
  size: number,
  number_of_subsets: number,
): T[][] => {
  let res: T[][] = [];
  if (Number.isInteger(size) && size > 0 && size < arr.length) {
    helper(0, [], arr, size, res);
    const gap = Math.floor(
      (res.length - number_of_subsets) / (number_of_subsets - 1),
    );
    let rem = (res.length - number_of_subsets) % (number_of_subsets - 1);
    const newRes: T[][] = [];
    let i = 0;
    while (i < res.length) {
      newRes.push(res[i]);
      i += gap + 1;
      if (rem > 0) {
        i++;
        rem--;
      }
    }
    res = newRes;
  }
  // console.log(counter);
  // console.log(res)
  // console.log(res.length);
  return res;
};

const helper = <T>(
  index: number,
  curr: T[],
  arr: T[],
  size: number,
  res: T[][],
) => {
  counter++;
  if (curr.length === size) {
    res.push(curr.slice());
    return;
  }
  if (curr.length + arr.length - index < size) return;
  for (let i = index; i < arr.length; i++) {
    curr.push(arr[i]);
    helper(i + 1, curr, arr, size, res);
    curr.pop();
  }
};

export const countVariation = <T>(arr: T[][]) => {
  const map = new Map<T, number>();
  for (let set of arr) {
    for (let item of set) {
      if (map.has(item)) {
        map.set(item, map.get(item) + 1);
      } else {
        map.set(item, 1);
      }
    }
  }
  const vals: { key: T; count: number }[] = [];
  for (let key of map.keys()) {
    vals.push({
      key,
      count: map.get(key),
    });
  }
  console.log(vals);
};
