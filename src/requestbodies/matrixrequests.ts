import { format, startOfWeek, endOfWeek, addHours } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { currentUser } from "../current-user";
import { getCurrentPayPeriod } from "../matrix";

// TODO: Need to grab payperiod somewhere else and store it.

// Request body to find all classes within the current workweek.
// Body is used in the getBookingsView function in matrix.ts
export const getBookingsRequestsBody = () => {
  const currentDate = utcToZonedTime(new Date(), currentUser.iana);
  const startDate = format(startOfWeek(currentDate), "yyyy-MM-dd'T'HH:mm:ss");
  const endDate = format(endOfWeek(currentDate, {}), "yyyy-MM-dd'T'HH:mm:ss");

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
