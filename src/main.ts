import * as dotenv from "dotenv";
dotenv.config();
import prompts from "prompts";
import { login } from "./api";
import { PAGES } from "./pages";
import { loadCurrentUser } from "./current-user";

const main = async () => {
  await login();
  await loadCurrentUser();
  await PAGES.homepage();
};

main().catch(console.error);
