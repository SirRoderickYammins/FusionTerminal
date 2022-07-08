import prompts from "prompts";
import { Session } from "../types/sessionTypes";

export const getTodaySelection = async (sessions: Session[]) => {
  return prompts([
    {
      type: "select",
      name: "sessionSelect",
      message: "Select the Session You Wish to Edit",
      choices: [
        ...sessions.map((session, index) => {
          return {
            title: session.title,
            description: `[${session.sessionNumber}/${session.sessionCountTotal}]`,
            value: index,
          };
        }),
        {
          title: "Go back",
          value: -1,
        },
      ],

      initial: 0,
    },
  ]);
};
