import prompts from "prompts";
import kleur from "kleur";

export const initialActionSelect = async () =>
  prompts([
    {
      type: "select",
      name: "initialActionSelect",
      message: "What do you want to do?",
      choices: [
        {
          title: kleur.magenta("Matrix"),
          description: "View your schedule and make changes",
          value: "lookSchedule",
        },
        {
          title: "Salesforce",
          description: "Session charting",
          value: 2,
          disabled: true,
        },
        {
          title: "Canvas",
          description: "Edit Classes and Assignments",
          value: 3,
          disabled: true,
        },
      ],
      initial: 0,
    },
  ]);
