import axios from "axios";
import { accessToken } from "./api";

export const getShit = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://matrix-api.fusionacademy.com/api/TodaysSchedule?=&campusId=51&startTime=2022-07-07T04:00:00&endTime=2022-07-08T03:00:00",
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
