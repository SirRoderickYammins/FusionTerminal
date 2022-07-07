import * as dotenv from "dotenv";
dotenv.config();
import prompts from "prompts";
import { login } from "./api";
import { getTodaysSchedule, setSessionStatus } from "./matrix";

const main = async () => {
  const response = await prompts(
    [
      {
        type: "multiselect",
        name: "color",
        message: "Pick colors",
        choices: [
          { title: "Red", value: "#ff0000" },
          { title: "Green", value: "#00ff00" },
          { title: "Blue", value: "#0000ff" },
        ],
      },
    ],
    {
      onSubmit(prompt, answer, answers) {
        console.log(answer);
      },
    }
  );
  console.log(response);

  // await login();

  // const shit = await getTodaysSchedule();
  // console.log(shit.sessions[0].appointmentStyle);
};

main().catch(console.error);
