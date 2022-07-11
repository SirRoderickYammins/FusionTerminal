import * as dotenv from "dotenv";
dotenv.config();
import prompts from "prompts";
import { login } from "./api";
import { PAGES } from "./pages";
import { loadCurrentUser, thisPayPeriod } from "./current-user";

const main = async () => {
  await login();
  await thisPayPeriod();
  await loadCurrentUser();
  await PAGES.homepage();
};

main().catch(console.error);
