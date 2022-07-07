import axios from "axios";
import { accessToken, client } from "./api";
import { format, addDays } from "date-fns";

const startTime = format(new Date(), "yyyy-MM-dd'T'04:00:00");
const endTime = format(addDays(new Date(), 1), "yyyy-MM-dd'T'03:00:00");

type Student = {
  firstName: string;
  lastName: string;
  userId: number;
  studentHashKey: string;
};

type Session = {
  teacherHashKey: string;
  hashKey: string;
  sessionType: string;
  sessionNumber: number;
  students: Student[];
  appointmentStyle: "renderedStudentAbsent" | "renderedTaught";
};

type TodaysSchedule = {
  userId: number;
  firstName: string;
  lastName: string;
  sessions: Session[];
};

export const getTodaysSchedule = (): Promise<TodaysSchedule> => {
  return new Promise((resolve, reject) => {
    client
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
          withCredentials: true,
        }
      )
      .then((res) => {
        // console.log("status", res.status);
        console.log("test", res.data);
        resolve(res.data.message);
      })
      .catch((err) => {
        console.log("An error has occurred processing your status update.");
        reject("Error.");
      });
  });
};
