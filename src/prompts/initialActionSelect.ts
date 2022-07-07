import prompts from "prompts";

export const initialActionSelect = async () =>
  prompts([
    {
      type: "select",
      name: "initialActionSelect",
      message: "What do you want to do?",
      choices: [
        {
          title: "Look at a Schedule",
          description: "View your schedule and make changes",
          value: "lookSchedule",
        },
        {
          title: "Look at a Schedule",
          description: "Blla blla",
          value: 2,
          disabled: true,
        },
      ],
      initial: 0,
    },
  ]);
