import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

interface OverwritePrice {
  startDateTime: Date;
  endDateTime: Date;
  pricePerHour: number;
}

const isWeekend = (date: dayjs.Dayjs): boolean => {
  const day = date.day();
  return day === 0 || day === 6;
};

export const calculatePrice = (
  startDateTime: Date,
  endDateTime: Date,
  pricePerHour: number,
  overwritePrice: OverwritePrice[] = []
): number => {
  let totalPrice = 0;

  const start = dayjs(startDateTime);
  const end = dayjs(endDateTime);

  // Sort the overwritePrice array by startDateTime
  const sortedOverwrites = overwritePrice.sort(
    (a, b) => a.startDateTime.getTime() - b.startDateTime.getTime()
  );

  let currentTime = start;

  while (currentTime.isBefore(end)) {
    let nextBoundary = end;
    let currentPricePerHour = pricePerHour;

    for (const overwrite of sortedOverwrites) {
      const overwriteStart = dayjs(overwrite.startDateTime);
      const overwriteEnd = dayjs(overwrite.endDateTime);

      if (
        currentTime.isSameOrAfter(overwriteStart) &&
        currentTime.isBefore(overwriteEnd)
      ) {
        nextBoundary = overwriteEnd.isBefore(end) ? overwriteEnd : end;
        currentPricePerHour = overwrite.pricePerHour;
        break;
      } else if (
        overwriteStart.isAfter(currentTime) &&
        overwriteStart.isBefore(nextBoundary)
      ) {
        nextBoundary = overwriteStart;
      }
    }

    // Ensure we break the interval at the end of the current day
    const endOfDay = currentTime.endOf("day").isBefore(nextBoundary)
      ? currentTime.endOf("day")
      : nextBoundary;

    // Calculate duration in minutes
    const durationMinutes = endOfDay.diff(currentTime, "minute");

    if (isWeekend(currentTime)) {
      currentPricePerHour *= 2;
    }

    const periodPrice = (currentPricePerHour / 60) * durationMinutes;
    totalPrice += periodPrice;

    // Move currentTime to the next interval
    currentTime = endOfDay.add(1, "second");
  }
  return parseFloat(totalPrice.toFixed(2));
};

export const calculatePrice2 = (
  startDateTime: Date,
  endDateTime: Date,
  pricePerHour: number,
  overwritePrice: OverwritePrice[] = []
): number => {
  //get earliest start date and the latest end date.
  const verStartDate = [
    startDateTime,
    ...overwritePrice.map((x) => x.startDateTime),
  ].sort((a, b) => a.getTime() - b.getTime())[0];

  const veryEndDate = [endDateTime, ...overwritePrice.map((x) => x.endDateTime)]
    .sort((a, b) => a.getTime() - b.getTime())
    .at(-1);

  console.log(verStartDate, veryEndDate);

  return 0;
};
