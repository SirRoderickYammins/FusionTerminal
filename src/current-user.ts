import { getCurrentPayPeriod, getCurrentUser } from "./matrix";
import { PayPeriod, UserInformation } from "./types/sessionTypes";

export let currentUser: UserInformation;

export let currentPayPeriod: PayPeriod;

export const loadCurrentUser = async () => {
  currentUser = await getCurrentUser();
};

export const thisPayPeriod = async () => {
  currentPayPeriod = await getCurrentPayPeriod();
}
