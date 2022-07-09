import { getCurrentUser } from "./matrix";
import { UserInformation } from "./types/sessionTypes";

export let currentUser: UserInformation;

export const loadCurrentUser = async () => {
  currentUser = await getCurrentUser();
};
