import prompts from "prompts";
import { Session } from "../types/sessionTypes";

export const getSessionActions = async (session: Session) => {
  return prompts([
    {
      type: "select",
      name: "sessionActions",
      message: "What do you want to do with this session?",
      hint: session.title,
      choices: [
        {
          title: "Mark as attended",
          value: "attended",
        },
        {
          title: "Mark as unattended",
          value: "unattended",
        },
        {
          title: "Go back",
          value: -1,
        },
      ],

      initial: 0,
    },
  ]);
};
