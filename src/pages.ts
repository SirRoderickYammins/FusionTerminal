import { initialActionSelect } from "./prompts/initialActionSelect";
import { getTodaySelection } from "./prompts/getTodaySelect";
import { getSessionActions } from "./prompts/getSessionActions";
import { matrixSelectionMenu, planningTimeMenu, planningTimeDisplayDashboard } from "./prompts/matrixActions";
import {
  getBookingsView,
  getCurrentUser,
  getTodaysSchedule,
  getUserHours,
  setSessionStatus,
} from "./matrix";
import { Session } from "./types/sessionTypes";
import { GetScheduleFreeTime, PlanningTimeBalance } from "./api";
import { createReservation } from "./matrix/createReservation";

export const PAGES = {
  homepage: async () => {
    console.clear();
    const response = await initialActionSelect();
    if (response.initialActionSelect === "lookSchedule") {
      PAGES.matrixActionsList();
    }
  },

  planningTimeMatrix: async () => {
    console.clear();
    const res = await planningTimeMenu();
    switch (res.PlanningTimeSelection) {
      case "viewPlanTime":
        console.clear();
        console.log("Loading Planning Time Balance. This may take a moment...");
        planningTimeDisplayDashboard(await PlanningTimeBalance()); 
        break;
      case "autoAddPlanning":
        GetScheduleFreeTime(await getBookingsView());
          // PAGES.matrixActionsList();
          console.log("Planning time added.");
        break;
      case "Return":
        PAGES.matrixActionsList();
    }
  },

  matrixActionsList: async () => {
    console.clear();
    const response = await matrixSelectionMenu();
    switch (response.MatrixActionSelect) {
      case "planningTimeSelection":
        await PAGES.planningTimeMatrix();
        break;
      case "todayScheduleSelection":
        PAGES.todaySchedule();
        break;
      case "Return":
        PAGES.homepage();
        break;
    }
  },
  todaySchedule: async () => {
    console.clear();
    console.log("Loading schedule...");
    const schedule = await getTodaysSchedule();
    console.clear();
    const response = await getTodaySelection(schedule.sessions);

    if (response.sessionSelect === -1) {
      await PAGES.homepage();
    } else {
      const session = schedule.sessions[response.sessionSelect];
      await PAGES.sessionStuff(session);
    }
  },
  sessionStuff: async (session: Session) => {
    console.clear();
    const response = await getSessionActions(session);
    if (response.sessionActions === "attended") {
      await setSessionStatus(session, true);
      await PAGES.todaySchedule();
    } else if (response.sessionActions === "absent") {
      await setSessionStatus(session, false);
      await PAGES.todaySchedule();
    } else {
      await PAGES.todaySchedule();
    }
  },
};
