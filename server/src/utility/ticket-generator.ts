const base_num = 3252725n;

const getRandomCapLetter = () => {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
};

export const ticketGenerator = (num: string) => {
  const newNum = base_num + BigInt(num);
  let str = '';
  for (let i = 0; i < 4; i++) {
    str = str.concat(getRandomCapLetter());
  }
  return (str.concat(newNum.toString()));
};