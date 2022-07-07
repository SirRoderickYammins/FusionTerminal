import * as dotenv from "dotenv";
dotenv.config();
import prompts from "prompts";
import { login } from "./api";
import { getShit } from "./matrix";
dotenv.config();

const main = async () => {
  await login();
  const shit = await getShit();
  console.log(shit);
  // const response = await prompts({
  //   type: "number",
  //   name: "value",
  //   message: "How old are you?",
  //   validate: (value) => (value < 18 ? `Nightclub is 18+ only` : true),
  // });
  // console.log(response); // => { value: 24 }
};

main().catch(console.error);
