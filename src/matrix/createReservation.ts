import { client, accessToken } from "../api";
import { currentUser } from "../current-user";

export const createReservation = async (startDate: string, endDate: string) => {
  return new Promise((resolve, reject) => {
    const body = {
      payCode: { hashKey: "93798bd2-fcdc-4614-a26f-0e2c5f0e5ecd" },
      campus: { hashKey: currentUser.defaultCampusHashKey },
      users: [
        {
          user: {
            hashKey: currentUser.hashKey,
          },
          level: 2,
        },
      ],
      title: "BTerm™ Planning Time Addition",
      description: "Automated Addition by BTerm™",
      reservationType: 2,
      startDate,
      endDate,
    };

    client
      .post(
        "https://matrix.fusionacademy.com/api/Schedule/CreateReservation",
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        // reject("There was an error creating a reservation.");
      });
  });
};
