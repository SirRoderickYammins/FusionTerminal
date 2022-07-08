import { initialActionSelect } from "./prompts/initialActionSelect";
import { getTodaySelection } from "./prompts/getTodaySelect";
import { getSessionActions } from "./prompts/getSessionActions";
import { getCurrentUser, getTodaysSchedule, getUserHours, setSessionStatus } from "./matrix";
import { Session, CampusHashKey } from "./types/sessionTypes";


export const PAGES = {
  homepage: async () => {
    console.clear();
    const response = await initialActionSelect();
    if (response.initialActionSelect === "lookSchedule") {
      await PAGES.todaySchedule();
    }
  },
  todaySchedule: async () => {
    console.clear();
    console.log("Loading schedule...");
    const schedule = await getTodaysSchedule();
    console.clear();
    // const campusHashKey = await getCurrentUser();
    // console.log(campusHashKey);
    // const planningTime = await getUserHours(campusHashKey);
    // console.log(planningTime.earnedPlanningTime.planningTimeBalanceMinutes);
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