import axios from "axios";
import { accessToken, client } from "./api";
import { format, addDays } from "date-fns";
import {
  BookingInformation,
  CampusHashKey,
  Schedule,
  Session,
  UserInformation,
} from "./types/sessionTypes";
import { getBookingsRequestsBody } from "./requestbodies/matrixrequests";

const startTime = format(new Date(), "yyyy-MM-dd'T'04:00:00");
const endTime = format(addDays(new Date(), 1), "yyyy-MM-dd'T'03:00:00");

export const getTodaysSchedule = (): Promise<Schedule> => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://matrix-api.fusionacademy.com/api/TodaysSchedule?=&campusId=50&startTime=${startTime}&endTime=${endTime}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const setSessionStatus = (session: Session, status: boolean) => {
  return new Promise((resolve, reject) => {
    const body = {
      explicitStatusUpdate: false,
      hashKey: session.hashKey,
      isCancelledSession: false,
      isVirtualSession: false,
      participants: [
        {
          attendance: 2,
          hashKey: session.teacherHashKey,
          type: 2,
        },
        {
          attendance: status ? 2 : 3,
          hashKey: session.students[0].studentHashKey,
          type: 3,
        },
      ],
    };
    client
      .post(
        "https://matrix.fusionacademy.com/api/Schedule/UpdateSessionStatus",
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data.message);
        resolve(res.data.message);
      })
      .catch((err) => {
        console.log("An error has occurred processing your status update.");
        reject("Error.");
      });
  });
};

export const getCurrentUser = (): Promise<CampusHashKey> => {
  return new Promise((resolve, reject) => {
    client
      .get("https://matrix.fusionacademy.com/api/Directory/GetCurrentUser", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log("An error has occurred.");
        reject("Error");
      });
  });
};

export const getUserHours = (
  defaultCampusHashKey: string
): Promise<UserInformation> => {
  return new Promise((resolve, reject) => {
    client
      .get(
        `https://matrix.fusionacademy.com/api/Schedule/GetCurrentUserHud?=&campusHashKey=${defaultCampusHashKey}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject("Error occurred obtaining planning time.");
      });
  });
};

export const getBookingsView = (): Promise<BookingInformation> => {
  return new Promise((resolve, reject) => {
    client
      .post(
        "https://matrix.fusionacademy.com/api/Schedule/GetBookingsView",
        getBookingsRequestsBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject("Error occurred getting your availability");
      });
  });
};
