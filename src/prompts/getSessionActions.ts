import prompts from "prompts";
import { Session } from "../types/sessionTypes";
import kleur from "kleur";
export const getSessionActions = async (session: Session) => {
  return prompts([
    {
      type: "select",
      name: "sessionActions",
      message: "What do you want to do with this session?",
      hint: session.title,
      choices: [
        {
          title: kleur.green("Mark as attended"),
          value: "attended",
        },
        {
          title: kleur.red("Mark as absent"),
          value: "absent",
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
