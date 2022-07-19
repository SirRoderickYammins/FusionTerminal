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
} from "date-fns";
import { utcToZonedTime, zonedTimeToUtc, format } from "date-fns-tz";
const holidays = require("@date/holidays-us");
import { currentPayPeriod, currentUser } from "./current-user";
import { createReservation } from "./matrix/createReservation";
import { start } from "repl";

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
      "https://matrix.fusionacademy.com/Account/Login?ReturnUrl=%2F",
      loginInfo,
      { withCredentials: true }
    )
    .then(() => {
      const cookies = jar.getCookiesSync("https://matrix.fusionacademy.com");
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
  // Sets the beginning of the week to Monday after pay period start at 7AM.
  const scheduleWindowBeginningOfWeek = addHours(
    addDays(
      startOfWeek(utcToZonedTime(currentPayPeriod.startDate, currentUser.iana)),
      1
    ),
    7
  );
  let scheduleWindowEndOfWeek = endOfWeek(
    utcToZonedTime(currentPayPeriod.startDate, currentUser.iana)
  );

  const endofDay = addHours(scheduleWindowBeginningOfWeek, 12);

  const bookings = await getBookingsView();

  const BookedTimes = bookings.reservations.map((eachSlot) => {
    return {
      startDate: eachSlot.startDate,
      endDate: eachSlot.endDate,
      differenceinTime: timeInterval(eachSlot.endDate, eachSlot.startDate),
    };
  });

  let AllSlots: Date[] = [];

  let currentDay = scheduleWindowBeginningOfWeek;

  while (!isEqual(currentDay, endofDay)) {
    AllSlots.push(currentDay);
    currentDay = addMinutes(currentDay, 30);
  }

  for (let i = 0; i < BookedTimes.length; i++) {
    if (
      isWithinInterval(
        zonedTimeToUtc(BookedTimes[i].startDate, currentUser.iana),
        {
          start: scheduleWindowBeginningOfWeek,
          end: endofDay,
        }
      )
    ) {
      AllSlots = AllSlots.filter(
        (slot) =>
          !isEqual(
            slot,
            zonedTimeToUtc(BookedTimes[i].startDate, currentUser.iana)
          ) &&
          !isEqual(
            slot,
            zonedTimeToUtc(BookedTimes[i].endDate, currentUser.iana)
          )
      );
    }
  }

  console.log(AllSlots);
};
