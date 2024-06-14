import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

interface OverwritePrice {
  startDateTime: Date;
  endDateTime: Date;
  pricePerHour: number;
}

export const calculatePrice = (
  startDateTime: Date,
  endDateTime: Date,
  pricePerHour: number,
  overwritePrice: OverwritePrice[] = []
): number => {
  let price = 0;
  let currentPricePerHour = pricePerHour;

  //put all dates into an array, and sort them, adjust time zone
  const allDates: Date[] = [
    startDateTime,
    endDateTime,
    ...overwritePrice.map((x) => dayjs(x.startDateTime).utc().toDate()),
    ...overwritePrice.map((x) => dayjs(x.endDateTime).utc().toDate()),
  ].sort((a, b) => a.getTime() - b.getTime());

  console.log(allDates);

  //iterate through all dates and check prices.
  for (let i = 0; i < allDates.length - 1; i++) {
    //get boundary prices.
    //current date >= startDateOveright && date< endDateOverright
    //return prices of that overwrite, else return default.
    const startBoundaryTime = allDates[i];
    const endBoundaryTime = allDates[i + 1];

    for (const overwrite of overwritePrice) {
      const overwriteStart = dayjs(overwrite.startDateTime);
      const overwriteEnd = dayjs(overwrite.endDateTime);
      const currentTime = dayjs(startBoundaryTime);
      if (
        currentTime.isSameOrAfter(overwriteStart) &&
        currentTime.isBefore(overwriteEnd)
      ) {
        //set price
        currentPricePerHour = overwrite.pricePerHour;
        break;
      } else {
        currentPricePerHour = pricePerHour;
      }
    }

    //loop through boundaries
    // get start and end boundary
    // calculate weekend minutes
    // calculate total minutes
    // total minutes - weekend mniutes = weekday minutes X
    // priceperhour/60 = pricePerMinute X
    // procePerMinute * weekday minutes = weekDayprice X
    // (priceperhour * 2)/60 = pricePerMinuteWeekendX
    // pricePerMinuteWeekend * weekend mniutes = weekendPrice X
    // price += (weekendPrice+weekDayprice)

    //calculate weekend minutes
    const weekendMinutes = calculateWeekendMinutes(
      startBoundaryTime,
      endBoundaryTime
    );
    //calculate total minutes
    const totalMinutes = getMinutesBetweenDates(
      startBoundaryTime,
      endBoundaryTime
    );

    console.log(
      "Start DAte",
      startBoundaryTime,
      "End Date",
      endBoundaryTime,
      "weekendMinutes",
      weekendMinutes,
      "totalMinutes",
      totalMinutes
    );

    console.log("currentPricePerHour", currentPricePerHour);

    const weekDayMinutes = totalMinutes - weekendMinutes;
    const pricePerMinute = currentPricePerHour / 60;

    const weekDayPrice = pricePerMinute * weekDayMinutes;
    const pricePerMiniuteWeekend = (currentPricePerHour * 2) / 60;
    const weekendPrice = pricePerMiniuteWeekend * weekendMinutes;

    price += weekendPrice + weekDayPrice;
  }

  return Math.round((price + Number.EPSILON) * 100) / 100;
};

function calculateWeekendMinutes(startDate: Date, endDate: Date): number {
  const MS_PER_MINUTE = 60 * 1000;
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const start = startDate;
  const end = endDate;

  // ensure start date is before end date
  if (start > end) return 0;

  // calculate total days between the dates
  const totalDays =
    Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;

  // calculate the number of weekend days within the date range
  let weekendDays = 0;
  for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
    const dayOfWeek = day.getDay();
    if (dayOfWeek === 6 || dayOfWeek === 0) weekendDays++;
  }

  // calculate the total minutes for weekend days
  let weekendMinutes = weekendDays * 24 * 60;

  // adjust minutes for partial weekend days at the start and end
  if (start.getDay() === 6 || start.getDay() === 0) {
    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0, 0);
    weekendMinutes -= (start.getTime() - startOfDay.getTime()) / MS_PER_MINUTE;
  }
  if (end.getDay() === 6 || end.getDay() === 0) {
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);
    weekendMinutes -= (endOfDay.getTime() - end.getTime()) / MS_PER_MINUTE;
  }

  return weekendMinutes;
}

function getMinutesBetweenDates(startDate: Date, endDate: Date): number {
  // get the difference in milliseconds
  const differenceInMillis = Math.abs(endDate.getTime() - startDate.getTime());

  // convert milliseconds to minutes
  const differenceInMinutes = differenceInMillis / (1000 * 60);

  return differenceInMinutes;
}
