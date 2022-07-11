import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import {
  getBookingsView,
  getCurrentPayPeriod,
  getCurrentUser,
  getUserHours,
} from "./matrix";
import { UserPlanningTime, BookingInformation } from "./types/sessionTypes";
import {
  startOfWeek,
  addDays,
  setHours,
  addMinutes,
  setMinutes,
  setSeconds,
  differenceInMinutes,
  addMonths,
} from "date-fns";
import { utcToZonedTime, zonedTimeToUtc, format } from "date-fns-tz";
const holidays = require("@date/holidays-us");
import { currentUser } from "./current-user";
import { createReservation } from "./matrix/createReservation";
import { getBookingsRequestsBody } from "./requestbodies/matrixrequests";

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

/** Gets schedule free blocks and sends the array of start/ending times to CreateReservation() */
export const GetScheduleFreeTime = async (booking_info: BookingInformation) => {
  // const reservations = booking_info.reservations;

  // const arrayOfClassBlocks = reservations.map((classblock) => {
  //   return [classblock.startDate, classblock.endDate];
  // });

  console.log(await getBookingsView());
};
