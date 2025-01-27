import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { getBookingsView, getCurrentUser, getUserHours } from "./matrix";
import { UserPlanningTime, BookingInformation } from "./types/sessionTypes";
import {
  startOfWeek,
  addDays,
  setHours,
  addMinutes,
  setMinutes,
  setSeconds,
  differenceInMinutes,
  endOfWeek,
  addHours,
  endOfDay,
  compareAsc,
  isEqual,
  isWithinInterval,
  startOfHour,
  min,
  max,
  getDate,
  getDay,
  differenceInHours,
  isSameDay,
  startOfMinute,
  isSaturday,
  isFriday,
} from "date-fns";
import { utcToZonedTime, zonedTimeToUtc, format } from "date-fns-tz";
const holidays = require("@date/holidays-us");
import { currentPayPeriod, currentUser } from "./current-user";
import { createReservation } from "./matrix/createReservation";
import { start } from "repl";
import { noPlanTimeErrorPage } from "./prompts/matrixActions";
import { PAGES } from "./pages";

const jar = new CookieJar();
export const client = wrapper(axios.create({ jar }));

const loginInfo = new URLSearchParams({
  UserName: process.env.USER_NAME ?? "",
  Password: process.env.PASSWORD ?? "",
}).toString();

export let accessToken = "";

export const login = async () => {
  await client
    .post(
      "URL REMOVED FOR PUBLIC REPO,
      loginInfo,
      { withCredentials: true }
    )
    .then(() => {
      const cookies = jar.getCookiesSync("URL REMOVED FOR PUBLIC REPO);
      accessToken = cookies[0].value;
    })
    .catch((err) => {
      console.log("Matrix is down.");
    });
};

export const PlanningTimeBalance = async (): Promise<
  UserPlanningTime["earnedPlanningTime"]["planningTimeBalanceMinutes"]
> => {
  const userInfo = await getUserHours(
    (
      await getCurrentUser()
    ).defaultCampusHashKey
  );
  const currentPlanningTimeBalance =
    userInfo.earnedPlanningTime.planningTimeBalanceMinutes -
    userInfo.earnedPlanningTime.usedPlanningTimeMinutes;
  return currentPlanningTimeBalance;
};

const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ssXXXXX", {
    timeZone: currentUser.iana,
  });
};

const timeInterval = (startTime: string, endTime: string) => {
  return differenceInMinutes(
    utcToZonedTime(startTime, currentUser.iana),
    utcToZonedTime(endTime, currentUser.iana)
  );
};

export const GetScheduleFreeTime = async () => {
  const userPlanObject = await getUserHours(currentUser.defaultCampusHashKey);
  const totalTimeInMins =
    userPlanObject.earnedPlanningTime.planningTimeBalanceMinutes;
  let totalUsablePlanningTime =
    totalTimeInMins - userPlanObject.earnedPlanningTime.usedPlanningTimeMinutes;

  if (totalUsablePlanningTime == 0) {
   await PAGES.noPlanningTime(); 
  }

  // Sets the beginning of the week to Monday after pay period start at 7AM.
  const scheduleWindowBeginningOfWeek = addHours(
    addDays(
      startOfWeek(utcToZonedTime(currentPayPeriod.startDate, currentUser.iana)),
      1
    ),
    7
  );
  let scheduleWindowEndOfWeek = addDays(
    addHours(
      startOfHour(
        endOfWeek(utcToZonedTime(currentPayPeriod.endDate, currentUser.iana), {
          weekStartsOn: 5,
        })
      ),
      16.5
    ),
    -6
  );

  const bookings = await getBookingsView();

  const BookedTimes = bookings.reservations.map((eachSlot) => {
    return {
      startDate: zonedTimeToUtc(eachSlot.startDate, currentUser.iana),
      endDate: zonedTimeToUtc(eachSlot.endDate, currentUser.iana),
      differenceinTime: timeInterval(eachSlot.endDate, eachSlot.startDate),
    };
  });

  let AllSlots = [];

  let currentDay = scheduleWindowBeginningOfWeek;

  let endofday = setHours(setMinutes(currentDay, 30), 19);

  let tempArr: Date[] = [];

  while (!isEqual(currentDay, scheduleWindowEndOfWeek)) {
    if (isEqual(currentDay, endofday)) {
      AllSlots.push(tempArr);
      tempArr = [];
      currentDay = setHours(setMinutes(addDays(currentDay, 1), 0), 7);
      endofday = addDays(endofday, 1);
    }
    if (isSaturday(endofday)) {
      endofday = addDays(endofday, 2);
      currentDay = addDays(scheduleWindowBeginningOfWeek, 7);
    }

    tempArr.push(currentDay);
    currentDay = addMinutes(currentDay, 30);
  }

  let startTime: Date;
  let endTime: Date;

  console.log("Generating free slot map.");
  const FreeSlots = AllSlots.map((slot) => {
    for (let i = 0; i < BookedTimes.length; i++) {
      if (!isEqual(slot[0], BookedTimes[i].startDate)) {
        startTime = slot[0];
      }

      for (let j = 0; j < slot.length; j++) {
        if (
          isEqual(slot[j], BookedTimes[i].startDate) &&
          isSameDay(slot[j], BookedTimes[i].startDate)
        ) {
          endTime = slot[j];
          break;
        }
      }
    }

    return {
      startDate: startTime,
      endDate: endTime,
      totalPlanningBlockTimeInMins: differenceInMinutes(endTime, startTime),
    };
  });

  // while (totalUsablePlanningTime > 0) {
  //   FreeSlots.forEach((freeSlot) => {});
  // }

  let i = 0;
  let usedPlanTime = 0;

  if (totalUsablePlanningTime > 0) {
    for (i; i < FreeSlots.length; i++) {
      let startTime = FreeSlots[i].startDate;

      // If block uses all available planning time if allowable.
      if (
        totalUsablePlanningTime < FreeSlots[i].totalPlanningBlockTimeInMins &&
        totalUsablePlanningTime != 0
      ) {
        let endTime = addMinutes(startTime, totalUsablePlanningTime);
        totalUsablePlanningTime -= totalUsablePlanningTime;
        createReservation(formatDate(startTime), formatDate(endTime));
        console.log("Planning time balance:", totalUsablePlanningTime);
      }

      // while (totalUsablePlanningTime - usedPlanTime > 0)
    }
  }
};
