import * as dotenv from "dotenv";
dotenv.config();
import prompts from "prompts";
import { login } from "./api";
import { getTodaysSchedule, setSessionStatus } from "./matrix";
import { initialActionSelect } from "./prompts/initialActionSelect";
import { getTodaySelection } from "./prompts/getTodaySelect";
import { getSessionActions } from "./prompts/getSessionActions";
import { Session } from "./types/sessionTypes";

const PAGES: Record<string, Function> = {
  homepage: async () => {
    const response = await initialActionSelect();
    if (response.initialActionSelect === "lookSchedule") {
      return { page: "todaySchedule", args: [] };
    } else {
      return undefined;
    }
  },
  todaySchedule: async () => {
    console.log("Loading schedule...");
    const schedule = await getTodaysSchedule();
    console.clear();
    const response = await getTodaySelection(schedule.sessions);
    if (response.sessionSelect === -1) {
      return { page: "homepage", args: [] };
    }
    const session = schedule.sessions[response.sessionSelect];

    return { page: "sessionStuff", args: [session] };
  },
  sessionStuff: async (session: Session) => {
    const response = await getSessionActions(session);
    if (response.sessionActions === "attended") {
      // TODO: Set the status to true
      // shit.sessions[0].appointmentStyle
    } else if (response.sessionActions === "unattended") {
      // TODO: Set the status to false
      // shit.sessions[0].appointmentStyle
    } else {
      return { page: "todaySchedule", args: [] };
    }
    console.log("Action:", response.sessionActions, "for", session.title);
    return undefined;
  },
};

const main = async () => {
  await login();

  // The default page should always be homepage
  let next: { page: string; args: any[] } | undefined = {
    page: "homepage",
    args: [],
  };

  do {
    console.clear();
    if (PAGES[next.page]) {
      next = await PAGES[next.page](...next.args);
    } else {
      console.log(`Error: ${next.page} doesn't exist.`);
    }
  } while (next);
};

main().catch(console.error);
