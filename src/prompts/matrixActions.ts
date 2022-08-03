import prompts from "prompts";
import kleur from "kleur";

export const matrixSelectionMenu = async () =>
  prompts([
    {
      type: "select",
      name: "MatrixActionSelect",
      message: "What do you want to do in Matrix?",
      choices: [
        {
          title: "Add/Check Planning Time",
          description: kleur.magenta("View planning time or have BTerm add it for you."),
          value: "planningTimeSelection",
        },
        {
          title: "Get Today's Schedule",
          description: "View/Render Classes",
          value: "todayScheduleSelection",
        },
        {
          title: "View your PTO Balance",
          description: "See your PTO balance",
          value: "getPTO",
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

export const planningTimeDisplayDashboard = async (
  planningTimeBalanceMinutes: number
) => {
  return prompts([
    {
      type: "select",
      name: "planTimeDisplay",
      message: `You have ${kleur.green(
        planningTimeBalanceMinutes
      )} minutes of planning time.`,
      choices: [
        {
          title: "Go back.",
          value: "Return",
        },
      ],
    },
  ]);
};

export const PTOBalanceMenu = async (ptoBalance: number) => {
  return prompts([
    {
      type: "select",
      name: "ptoHours",
      message: `You have ${kleur.green(ptoBalance)} hours of PTO`,
      choices: [
        {
          title: "Go back",
          value: "Return",
        },
      ],
      initial: 0,
    },
  ]);
};

export const noPlanTimeErrorPage = async () => {
  return prompts([
    {
      type: "select",
      name: "planErrorSelect",
      message: `${kleur.red("You don't have any planning time.")}`,
      choices: [
        {
          title: "Go back",
          value: 1,
        }
      ]

    }
  ])
}
