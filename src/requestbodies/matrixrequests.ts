import { format, Day } from "date-fns";

const today = format(new Date(), "yyyy-MM-dd");
console.log(today);

// Request body to find all classes within the current workweek.
// Body is used in the getBookingsView function in matrix.ts
export const getBookingsRequestsBody = {
  dateRangeFilters: [
    {
      startDate: "2022-07-03T00:00:00-04:00",
      endDate: "2022-07-09T23:59:59-04:00",
      filterType: 1,
    },
  ],
  reservationFilters: [
    {
      userFilters: [
        { hashKeys: ["26cc2f9d-95a7-4bad-a2f7-9e4a5b3f3578"], filterType: 1 },
      ],
      filterType: 9,
    },
  ],
  blackoutFilters: [
    {
      seriesFilters: [
        {
          userHashKeys: ["26cc2f9d-95a7-4bad-a2f7-9e4a5b3f3578"],
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
          campusHashKeys: ["2a767fdc-1174-55de-b2c9-24bf91dd5bd1"],
          filterType: 2,
        },
      ],
      filterType: 3,
    },
    {
      seriesFilters: [
        {
          userHashKeys: ["26cc2f9d-95a7-4bad-a2f7-9e4a5b3f3578"],
          filterType: 3,
        },
      ],
      filterType: 3,
    },
  ],
};
