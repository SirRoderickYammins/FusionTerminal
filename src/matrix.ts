import axios from "axios";
import { accessToken } from "./api";
import { format, addDays } from "date-fns";
import { Schedule, Session } from "./types/sessionTypes";

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
    axios
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
