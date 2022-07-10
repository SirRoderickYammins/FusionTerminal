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
          value: "Matrix",
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
        {
          title: "Quit BTerm",
          description: "Leave the program.",
          value: 4,
        },
      ],
      initial: 0,
    },
  ]);
