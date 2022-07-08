import { initialActionSelect } from "./prompts/initialActionSelect";
import { getTodaySelection } from "./prompts/getTodaySelect";
import { getSessionActions } from "./prompts/getSessionActions";
import { matrixSelectionMenu, planningTimeMenu } from "./prompts/matrixActions";
import {
  getCurrentUser,
  getTodaysSchedule,
  getUserHours,
  setSessionStatus,
} from "./matrix";
import { Session, CampusHashKey } from "./types/sessionTypes";
import { PlanningTimeBalance } from "./api";

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
        console.log("Loading planning time. This may take a few seconds.");
        console.log(
          `You have ${await PlanningTimeBalance()} minutes of planning time.`
        );
        break;
      case "Automatically Add Planning Time":
      // TODO: Make planning time function.
    }
  },

  matrixActionsList: async () => {
    console.clear();
    const response = await matrixSelectionMenu();
    switch (response.MatrixActionSelect) {
      case "planningTimeSelection":
        console.clear();
        await PAGES.planningTimeMatrix();
        break;
      case "todayScheduleSelection":
        console.clear();
        PAGES.todaySchedule();
        break;
      case "Return":
        console.clear();
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
