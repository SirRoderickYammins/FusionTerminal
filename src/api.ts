import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { getCurrentUser, getUserHours } from "./matrix";
import { UserPlanningTime, BookingInformation } from "./types/sessionTypes";
import { format, startOfWeek, endOfWeek, addDays, addHours } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { currentUser } from "./current-user";

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
  const planningTimeMins = await getUserHours(
    (
      await getCurrentUser()
    ).defaultCampusHashKey
  );
  return planningTimeMins.earnedPlanningTime.planningTimeBalanceMinutes;
};

export const GetScheduleFreeTime = (booking_info: BookingInformation) => {
  const bookedSlots = booking_info.reservations.map((eachClass) => {
    return {
      startDate: new Date(eachClass.startDate),
      endDate: new Date(eachClass.endDate),
    };
  });

  console.log(bookedSlots);
  const currentDate = utcToZonedTime(new Date(), currentUser.iana);
  const mondayOfWorkWeek = format(
    addHours(addDays(startOfWeek(currentDate), 1), 7),
    "yyyy-MM-dd'T'HH:mm:ssXXXXX"
  );
  console.log(mondayOfWorkWeek);
};
