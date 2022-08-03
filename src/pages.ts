import { initialActionSelect } from "./prompts/initialActionSelect";
import { getTodaySelection } from "./prompts/getTodaySelect";
import { getSessionActions } from "./prompts/getSessionActions";
import {
  matrixSelectionMenu,
  planningTimeMenu,
  planningTimeDisplayDashboard,
  PTOBalanceMenu,
  noPlanTimeErrorPage,
} from "./prompts/matrixActions";
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
import { currentUser } from "./current-user";

export const PAGES = {
  homepage: async () => {
    console.clear();
    const response = await initialActionSelect();
    switch (response.initialActionSelect) {
      case "Matrix":
        PAGES.matrixActionsList();
        break;
      case 4:
        console.clear();
        process.exit();
    }
  },

  noPlanningTime: async () => {
    console.clear();
    const res = await noPlanTimeErrorPage();
    if (res.planErrorSelect == 1){
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
        const res = await planningTimeDisplayDashboard(
          await PlanningTimeBalance()
        );
        if (res.planTimeDisplay == "Return") {
          PAGES.matrixActionsList();
        }
        break;
      case "autoAddPlanning":
        await GetScheduleFreeTime();
        // PAGES.matrixActionsList();
        PAGES.matrixActionsList(); 
        break;
      case "Return":
        PAGES.matrixActionsList();
    }
  },

  ptoBalanceMenu: async () => {
    console.clear();
    const res = await PTOBalanceMenu(
      currentUser.employeeRecord.ptoBalanceHours
    );
    if (res.ptoHours == "Return") {
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
      case "getPTO":
        await PAGES.ptoBalanceMenu();
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

    const response = await getTodaySelection(schedule.sessions, currentUser);

    if (response.sessionSelect === -1) {
      await PAGES.matrixActionsList();
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
