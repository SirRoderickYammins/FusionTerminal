import prompts from "prompts";

export const matrixSelectionMenu = async () =>
  prompts([
    {
      type: "select",
      name: "MatrixActionSelect",
      message: "What do you want to do in Matrix?",
      choices: [
        {
          title: "Add/Check Planning Time",
          description: "Automatically Add All Planning Time",
          value: "planningTimeSelection",
        },
        {
          title: "Get Today's Schedule",
          description: "View/Render Classes",
          value: "todayScheduleSelection",
        },
        {
          title: "Go Back",
          value: "Return",
        },
      ],
      initial: 0,
    },
  ]);

export const planningTimeMenu = async () =>
  prompts([
    {
      type: "select",
      name: "PlanningTimeSelection",
      message: "Select an Option",
      choices: [
        {
          title: "Check Planning Time",
          description: "View your planning time",
          value: "viewPlanTime",
        },
        {
          title: "Automatically Add Planning Time",
          description:
            "Empty spaces in your schedule will be filled with planning time.",
          value: "autoAddPlanning",
        },
        {
          title: "Go Back",
          value: "Return",
        },
      ],
      initial: 0,
    },
  ]);
