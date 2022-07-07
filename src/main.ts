import * as dotenv from "dotenv";
dotenv.config();
import prompts from "prompts";
import { login } from "./api";
import { getTodaysSchedule, setSessionStatus } from "./matrix";
import { initialActionSelect } from "./prompts/initialActionSelect";
import { getTodaySelection } from "./prompts/getTodaySelect";

const main = async () => {
  console.clear();
  await login();
  const response = await initialActionSelect();
  console.clear();

  switch (response.initialActionSelect) {
    case "lookSchedule":
      const schedule = await getTodaysSchedule();
      const response = await getTodaySelection(schedule.sessions);
      console.log(schedule.sessions[response.sessionSelect]);
      break;

    default:
      console.log("get fucked");
      break;
  }

  // console.log(shit.sessions[0].appointmentStyle);
};

main().catch(console.error);
