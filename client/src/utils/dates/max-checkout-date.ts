import {
  addDays,
  compareAsc,
  differenceInDays,
  isWithinInterval,
  subDays,
} from 'date-fns';

export function getMaxCheckOutDate(
  checkIn: Date,
  maxDateRange: number,
  bookingList: [Date, Date][][],
): Date {
  let res = addDays(checkIn, 1);
  const maxPossibleCheckOutDate = addDays(checkIn, maxDateRange);
  for (let cabin of bookingList) {
    let isValidCheckIn = true;
    for (let booking of cabin) {
      if (compareAsc(checkIn, booking[0]) < 0) {
        if (compareAsc(booking[0], res) > 0) {
          res = new Date(booking[0]);
          if (differenceInDays(res, checkIn) >= maxDateRange) {
            return maxPossibleCheckOutDate;
          }
        }
        isValidCheckIn = false;
        break;
      } else if (
        isWithinInterval(checkIn, {
          start: booking[0],
          end: subDays(booking[1], 1),
        })
      ) {
        isValidCheckIn = false;
        break;
      }
    }
    if (isValidCheckIn) {
      return maxPossibleCheckOutDate;
    }
  }

  return res;
}
