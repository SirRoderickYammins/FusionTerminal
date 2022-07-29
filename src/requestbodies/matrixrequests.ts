import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { currentUser } from "../current-user";
import { currentPayPeriod } from "../current-user";

// Request body to find all classes within the current workweek.
// Body is used in the getBookingsView function in matrix.ts
export const getBookingsRequestsBody = () => {

  const currentDate = utcToZonedTime(currentPayPeriod.startDate, currentUser.iana);
  const startDate = format(startOfWeek(currentDate), "yyyy-MM-dd'T'HH:mm:ss");
  const endDate = format(addDays(endOfWeek(currentDate), 7), "yyyy-MM-dd'T'HH:mm:ss");

  // console.log("Here  is  the current payperiod"  + startDate + endDate);

  const { hashKey: teacherHashKey, defaultCampusHashKey: campusHashKey } =
    currentUser;
  return {
    dateRangeFilters: [
      {
        startDate: `${startDate}`,
        endDate: `${endDate}`,
        filterType: 1,
      },
    ],
    reservationFilters: [
      {
        userFilters: [{ hashKeys: [teacherHashKey], filterType: 1 }],
        filterType: 9,
      },
    ],
    blackoutFilters: [
      {
        seriesFilters: [
          {
            userHashKeys: [teacherHashKey],
            filterType: 3,
          },
        ],
        filterType: 2,
      },
    ],
    staffAvailabilityFilters: [
      {
        seriesFilters: [
          {
            campusHashKeys: [campusHashKey],
            filterType: 2,
          },
        ],
        filterType: 3,
      },
      {
        seriesFilters: [
          {
            userHashKeys: [teacherHashKey],
            filterType: 3,
          },
        ],
        filterType: 3,
      },
    ],
  };
};
