import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { getCurrentUser, getUserHours } from "./matrix";
import { UserInformation, BookingInformation } from "./types/sessionTypes";

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
  UserInformation["earnedPlanningTime"]["planningTimeBalanceMinutes"]
> => {
  const planningTimeMins = await getUserHours(
    (
      await getCurrentUser()
    ).defaultCampusHashKey
  );
  return planningTimeMins.earnedPlanningTime.planningTimeBalanceMinutes;
};

export const GetScheduleFreeTime = (booking_info: BookingInformation) => {
  console.log(booking_info.reservations.map((startDate, index) => {
      // IDK how to do this.
      // Reservations is an array of sessions for the whole week.
      // If i do booking_info.reservations[0].startDate, I get the start time
      // of the first class I had this week.
      // Just need map to loop thru the array and return an array of arrays,
      // [{startDate, endDate}, {startDate2, endDate2} ...]



  }));
  
}