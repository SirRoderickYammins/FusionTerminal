import * as dotenv from "dotenv";
dotenv.config();
import prompts from "prompts";
import { login } from "./api";
import { getTodaysSchedule, setSessionStatus } from "./matrix";
import { initialActionSelect } from "./prompts/initialActionSelect";
import { getTodaySelection } from "./prompts/getTodaySelect";
import { getSessionActions } from "./prompts/getSessionActions";
import { Session } from "./types/sessionTypes";

const PAGES = {
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
      // setSessionStatus(session, true); returns undefined...
    } else if (response.sessionActions === "absent") {
      // setSessionStatus(session, false);
    } else {
      await PAGES.todaySchedule();
    }
  },
};

const main = async () => {
  await login();
  await PAGES.homepage();
};

main().catch(console.error);
