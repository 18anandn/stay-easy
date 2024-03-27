import {
  parseISO,
  startOfYear,
  add,
  endOfMonth,
  format,
  addYears,
} from 'date-fns';

const today = new Date();

let curr = parseISO('2023-01-01');
const end = startOfYear(endOfMonth(add(today, { years: 1, months: 1 })));

const temp: string[] = [];

while (curr <= end) {
  temp.push(format(curr, 'yyyy'));
  curr = addYears(curr, 1);
}

export const years = {
  arr: temp,
  current_year: format(today, 'yyyy'),
};
