import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { TimeZoneDetails } from '../../types/TimeZoneDetails';

export function getTimeZoneDiff(timezone: string): TimeZoneDetails {
  const localDate: Date = new Date();
  const client_tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const otherDate = utcToZonedTime(
    zonedTimeToUtc(localDate, client_tz),
    timezone,
  );
  const diff = localDate.getTime() - otherDate.getTime();

  return {
    local: client_tz,
    other: timezone,
    diff,
    formatted: formatMillisecondsToHHMM(Math.abs(diff)),
  };
}

function formatMillisecondsToHHMM(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${formattedHours}:${formattedMinutes}`;
}

// function calculatePopupPosition(
//   containerWidth: number,
//   containerHeight: number,
//   markerWidth: number,
//   markerHeight: number,
//   markerLeft: number,
//   markerTop: number,
//   popupWidth: number,
//   popupHeight: number,
//   padding: number,
//   popupHorizontalPadding: number,
//   popupVerticalPadding: number,
// ): Offset {
//   const markerPosX = markerLeft + markerWidth / 2;
//   const markerPosY = markerTop + markerHeight / 2;
//   const topDist = markerTop - (padding + (popupHeight + markerHeight) / 2);
//   const bottomDist =
//     containerHeight -
//     (markerTop + (padding + (popupHeight + markerHeight) / 2));
//   const leftDist = markerLeft - (padding + (popupWidth + markerWidth) / 2);
//   const rightDist =
//     containerWidth - (markerLeft - (padding + (popupWidth + markerWidth) / 2));
//   if (popupHeight + 2 * popupVerticalPadding >= containerHeight) {
//     if (leftDist >= popupHorizontalPadding && leftDist >= rightDist) {
//       return {
//         top: 0,
//         left: -(padding + (popupWidth + markerWidth) / 2),
//       };
//     } else if (rightDist >= popupHorizontalPadding && rightDist >= leftDist) {
//       return {
//         top: 0,
//         left: padding + (popupWidth + markerWidth) / 2,
//       };
//     } else {
//       return {
//         top: containerHeight / 2 - markerPosY,
//         left: containerWidth / 2 - markerPosX,
//       };
//     }
//   } else if (topDist > popupVerticalPadding) {
//     const topLeftDist = markerPosX - popupWidth / 2;
//     const topRightDist = containerWidth - (markerPosX + popupWidth / 2);
//     if (popupWidth + 2 * popupHorizontalPadding >= containerWidth) {
//       return {
//         top: -(padding + (popupHeight + markerHeight) / 2),
//         left: containerWidth / 2 - (markerLeft + markerWidth / 2),
//       };
//     } else if (
//       topLeftDist >= popupHorizontalPadding &&
//       topRightDist >= popupHorizontalPadding
//     ) {
//       return {
//         top: -(padding + (popupHeight + markerHeight) / 2),
//         left: 0,
//       };
//     } else if (topLeftDist >= topRightDist) {
//       return {
//         top: -(padding + (popupHeight + markerHeight) / 2),
//         left:
//           containerWidth - popupHorizontalPadding - popupWidth / 2 - markerPosX,
//       };
//     } else {
//       return {
//         top: -(padding + (popupHeight + markerHeight) / 2),
//         left: markerPosX + popupHorizontalPadding + popupWidth / 2,
//       };
//     }
//   } else if (bottomDist > popupVerticalPadding) {
//     const bottomLeftDist = markerPosX - popupWidth / 2;
//     const bottomRightDist = containerWidth - (markerPosX + popupWidth / 2);
//     if (popupWidth + 2 * popupHorizontalPadding >= containerWidth) {
//       return {
//         top: padding + (popupHeight + markerHeight) / 2,
//         left: containerWidth / 2 - (markerLeft + markerWidth / 2),
//       };
//     } else if (
//       bottomLeftDist >= popupHorizontalPadding &&
//       bottomRightDist >= popupHorizontalPadding
//     ) {
//       return {
//         top: padding + (popupHeight + markerHeight) / 2,
//         left: 0,
//       };
//     } else if (bottomLeftDist >= bottomRightDist) {
//       return {
//         top: padding + (popupHeight + markerHeight) / 2,
//         left:
//           containerWidth - popupHorizontalPadding - popupWidth / 2 - markerPosX,
//       };
//     } else {
//       return {
//         top: padding + (popupHeight + markerHeight) / 2,
//         left: markerPosX + popupHorizontalPadding + popupWidth / 2,
//       };
//     }
//   } else {
//   }

//   return { top: 0, left: 0 };
// }