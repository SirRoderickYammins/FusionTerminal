import axios from "axios";
import { accessToken, client } from "./api";
import { format, addDays } from "date-fns";
import {
  BookingInformation,
  PayPeriod,
  Schedule,
  Session,
  UserInformation,
  UserPlanningTime,
} from "./types/sessionTypes";
import { getBookingsRequestsBody } from "./requestbodies/matrixrequests";

export const getTodaysSchedule = (): Promise<Schedule> => {
  const startTime = format(new Date(), "yyyy-MM-dd'T'04:00:00");
  const endTime = format(addDays(new Date(), 1), "yyyy-MM-dd'T'03:00:00");

  return new Promise((resolve, reject) => {
    axios
      .get(
        `URL REMOVED FOR PUBLIC REPO`,
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
        "URL REMOVED FOR PUBLIC REPO",
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        resolve(res.data.message);
      })
      .catch((err) => {
        console.log("An error has occurred processing your status update.");
        reject("Error.");
      });
  });
};

export const getCurrentUser = (): Promise<UserInformation> => {
  return new Promise((resolve, reject) => {
    client
      .get("URL REMOVED FOR PUBLIC REPO", {
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
): Promise<UserPlanningTime> => {
  return new Promise((resolve, reject) => {
    client
      .get(
        `URL REMOVED FOR PUBLIC REPO`,
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
        "URL REMOVED FOR PUBLIC REPO`,
        getBookingsRequestsBody(),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        reject("Error occurred getting your availability");
      });
  });
};

export const getCurrentPayPeriod = (): Promise<PayPeriod> => {
  return new Promise((resolve, reject) => {
    client
      .get("URL REMOVED FOR PUBLIC REPO", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
