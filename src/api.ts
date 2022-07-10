import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { getCurrentUser, getUserHours } from "./matrix";
import { UserPlanningTime, BookingInformation } from "./types/sessionTypes";
import {
  startOfWeek,
  addDays,
  setHours,
  addMinutes,
  setMinutes,
  differenceInMinutes,
} from "date-fns";
import { utcToZonedTime, format } from "date-fns-tz";
import { currentUser } from "./current-user";
import { createReservation } from "./matrix/createReservation";

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

export const GetScheduleFreeTime = async (booking_info: BookingInformation) => {
  const { reservations: bookedSlots } = booking_info;

  // Get the date for the start of the week
  // The reason we're getting it at 6:30 is because the while loop below adds 30 minutes in the beginning of it
  let date = setMinutes(
    setHours(
      addDays(startOfWeek(utcToZonedTime(new Date(), currentUser.iana)), 1),
      6
    ),
    30
  );

  // This is where all of the free slot times will be stored
  let freeSlots: {
    startDate: string;
    endDate: string;
  }[] = [];
  // This is a temporary variable to store the current free slot while we loop through the week
  let currentFreeSlot:
    | { startDate: string | undefined; endDate: string | undefined }
    | undefined;
  // We want to keep an eye on the allocatedTime, and stop the loop when we've reached our total time
  // the total time will probably have to be fed as a parameter
  let allocatedTime = 0;
  const totalTimeAvailable = await PlanningTimeBalance();
  // We want to know when is the end of a day time so we can immediately move to the next day
  const endOfDayTime = "19:00:00";

  while (allocatedTime < totalTimeAvailable) {
    date = addMinutes(date, 30);

    const isEndOfDay =
      format(date, "HH:mm:ss", { timeZone: currentUser.iana }) === endOfDayTime;

    if (isEndOfDay) {
      // If we have an active currentFreeSlot, we need to add the endDate to the end of the day time and add it to freeSLots
      if (currentFreeSlot) {
        freeSlots.push({
          startDate: currentFreeSlot.startDate as string,
          endDate: formatDate(date),
        });
        allocatedTime += 30;
      }

      currentFreeSlot = undefined;
      // We move to the next day, at 6:30 am
      date = setMinutes(setHours(addDays(date, 1), 6), 30);

      // TODO: Add a check to see if we're reached the weekend, if yes, kill the loop
      continue;
    }

    const conflict = bookedSlots.find(
      (slot) => slot.startDate === formatDate(date)
    );

    if (!conflict && !currentFreeSlot) {
      currentFreeSlot = {
        startDate: formatDate(date),
        endDate: undefined,
      };
    } else if (!conflict && currentFreeSlot) {
      currentFreeSlot.endDate = formatDate(date);
      allocatedTime += 30;
    } else if (conflict && currentFreeSlot) {
      allocatedTime += 30;
      freeSlots.push({
        startDate: currentFreeSlot.startDate as string,
        endDate: formatDate(date),
      });
      currentFreeSlot = undefined;

      // We want to know how many minutes the booked session has so that we can move that amount of time forward
      const minutesBetween = differenceInMinutes(
        new Date(conflict.endDate),
        new Date(conflict.startDate)
      );
      addMinutes(date, minutesBetween - 30);
    }

    if (allocatedTime >= totalTimeAvailable) {
      if (currentFreeSlot) {
        freeSlots.push({
          startDate: currentFreeSlot.startDate as string,
          endDate: formatDate(date),
        });
      }
      break;
    }
  }

  freeSlots.forEach(async (slot) => {
    await createReservation(slot.startDate, slot.endDate);
  });

  console.log("Allocated time: ", allocatedTime, "/", totalTimeAvailable);
  console.log("Free slots:", freeSlots);
};
