import kleur from "kleur";
import prompts from "prompts";
import { Session } from "../types/sessionTypes";
import format from "date-fns/format";
import { isSunday, isSaturday } from "date-fns";

const sessionRenderStatus = (appointmentStatus: string) => {
  if (appointmentStatus == "renderedTaught") {
    return kleur.green("Rendered Taught");
  }
  if (appointmentStatus == "renderedStudentAbsent") {
    return kleur.red("Rendered Absent");
  } else {
    return "Session Not Rendered";
  }
};

export const getTodaySelection = async (sessions: Session[]) => {
  const todayDate = new Date();
  const corporateSlaveMessage = () => {
    if (isSunday(todayDate) || isSaturday(todayDate)) {
      return kleur.red("It's the weekend. Stop working and go relax.");
    } else return "Select the Session You Wish to Edit";
  };
  return prompts([
    {
      type: "select",
      name: "sessionSelect",
      message: `${corporateSlaveMessage()}`,
      choices: [
        ...sessions
          .sort((a, b) => {
            const aStartTime = new Date(a.startTime);
            const bStartTime = new Date(b.startTime);
            return aStartTime.getTime() - bStartTime.getTime();
          })
          .map((session, index) => {
            // Converting the timezone of the date to the one that the campus.iana provides
            const startTime = new Date(
              new Date(session.startTime).toLocaleString("en-US", {
                timeZone: session.series.campus.iana,
              })
            );
            const startTimeFormatted = format(startTime, "HH:mm");

            return {
              title: `${startTimeFormatted} - ${session.title} [${session.sessionNumber}/${session.sessionCountTotal}] `,
              description: ` Session Status: ${sessionRenderStatus(
                session.appointmentStyle
              )}`,
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
